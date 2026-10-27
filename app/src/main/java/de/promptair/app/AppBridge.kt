package de.promptair.app

import android.content.ContentValues
import android.content.Intent
import android.net.Uri
import android.os.Environment
import android.os.Handler
import android.os.Looper
import android.provider.MediaStore
import android.util.Base64
import android.view.WindowManager
import android.webkit.JavascriptInterface
import android.webkit.WebView
import androidx.core.view.WindowCompat
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.WindowInsetsControllerCompat
import java.io.OutputStream
import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.atomic.AtomicInteger

/**
 * Native Helfer für den Web-Prompter (JS-Name: AndroidApp).
 *
 *  - Videos: [beginSave]/[saveChunk]/[endSave] schreiben schon während der Aufnahme
 *    stückweise nach Filme/PromptAir (MediaStore).
 *  - Skript-Export: [exportText] öffnet den Android-Dialog "Speichern unter" (beliebiger Ort).
 *  - Wachhalten, Vollbild, Sprache, Unterseiten.
 *
 * Rückmeldungen sind Kennungen (z. B. "saved_video"); die Seite übersetzt sie.
 * Alle @JavascriptInterface-Methoden laufen auf dem JS-Thread, nicht dem UI-Thread.
 */
class AppBridge(
    private val activity: MainActivity,
    private val web: WebView
) {
    private val main = Handler(Looper.getMainLooper())
    private val counter = AtomicInteger(0)

    private class Pending(val uri: Uri, val out: OutputStream, val kind: String)
    private val pending = ConcurrentHashMap<String, Pending>()

    // ---------------- Video speichern (MediaStore) ----------------

    @JavascriptInterface
    fun beginSave(name: String, mime: String, kind: String): String {
        val resolver = activity.contentResolver
        val isVideo = kind == "video"
        val safeName = name.replace(Regex("[\\\\/:*?\"<>|]"), "_").take(120).ifBlank { "PromptAir" }
        val values = ContentValues().apply {
            put(MediaStore.MediaColumns.DISPLAY_NAME, safeName)
            put(MediaStore.MediaColumns.MIME_TYPE, mime.ifBlank { "application/octet-stream" })
            put(
                MediaStore.MediaColumns.RELATIVE_PATH,
                if (isVideo) "${Environment.DIRECTORY_MOVIES}/PromptAir"
                else "${Environment.DIRECTORY_DOWNLOADS}/PromptAir"
            )
            put(MediaStore.MediaColumns.IS_PENDING, 1)
        }
        val collection = if (isVideo)
            MediaStore.Video.Media.getContentUri(MediaStore.VOLUME_EXTERNAL_PRIMARY)
        else
            MediaStore.Downloads.getContentUri(MediaStore.VOLUME_EXTERNAL_PRIMARY)

        return runCatching {
            val uri = resolver.insert(collection, values) ?: return ""
            val out = resolver.openOutputStream(uri) ?: run { resolver.delete(uri, null, null); return "" }
            val id = "s${counter.incrementAndGet()}"
            pending[id] = Pending(uri, out, kind)
            id
        }.getOrDefault("")
    }

    @JavascriptInterface
    fun saveChunk(id: String, base64: String): Boolean {
        val p = pending[id] ?: return false
        return runCatching { p.out.write(Base64.decode(base64, Base64.DEFAULT)) }.isSuccess
    }

    /** Rückgabe: "saved_video", "saved_text" oder "save_failed". */
    @JavascriptInterface
    fun endSave(id: String): String {
        val p = pending.remove(id) ?: return "save_failed"
        return runCatching {
            p.out.flush(); p.out.close()
            val done = ContentValues().apply { put(MediaStore.MediaColumns.IS_PENDING, 0) }
            activity.contentResolver.update(p.uri, done, null, null)
            if (p.kind == "video") "saved_video" else "saved_text"
        }.getOrElse {
            runCatching { activity.contentResolver.delete(p.uri, null, null) }
            "save_failed"
        }
    }

    @JavascriptInterface
    fun abortSave(id: String) {
        val p = pending.remove(id) ?: return
        runCatching { p.out.close() }
        runCatching { activity.contentResolver.delete(p.uri, null, null) }
    }

    // ---------------- Skript exportieren: "Speichern unter" ----------------

    /** Öffnet den System-Dialog; Ergebnis kommt als __promptairEvent("export_ok" | "export_failed" | "export_cancel"). */
    @JavascriptInterface
    fun exportText(fileName: String, text: String) {
        main.post { activity.startExport(fileName, text) }
    }

    // ---------------- Bildschirm ----------------

    @JavascriptInterface
    fun keepAwake(on: Boolean) {
        main.post {
            if (on) activity.window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)
            else activity.window.clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)
        }
    }

    @JavascriptInterface
    fun setFullscreen(on: Boolean) {
        main.post {
            val ctl = WindowCompat.getInsetsController(activity.window, activity.window.decorView)
            if (on) {
                ctl.systemBarsBehavior = WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
                ctl.hide(WindowInsetsCompat.Type.systemBars())
            } else {
                ctl.show(WindowInsetsCompat.Type.systemBars())
            }
        }
    }

    // ---------------- Sprache ----------------

    /** Die Seite meldet ihre Oberflächensprache (de, en, es, fr, pt, it). */
    @JavascriptInterface
    fun setLanguage(lang: String) {
        LocaleHelper.save(activity, lang)
    }

    // ---------------- Unterseiten ----------------

    /** [speechLang] = Sprache des Skripts (BCP-47, z. B. "de-DE") für die Stimmenauswahl. */
    @JavascriptInterface
    fun openSpeak(title: String, text: String, speechLang: String) {
        main.post {
            activity.startActivity(
                Intent(activity, SpeakActivity::class.java)
                    .putExtra(SpeakActivity.EXTRA_TITLE, title)
                    .putExtra(SpeakActivity.EXTRA_TEXT, text.take(100_000))
                    .putExtra(SpeakActivity.EXTRA_LANG, speechLang)
            )
        }
    }

    @JavascriptInterface
    fun openLicenses() {
        main.post { activity.startActivity(Intent(activity, LicensesActivity::class.java)) }
    }

    @JavascriptInterface
    fun appVersion(): String = BuildConfig.VERSION_NAME

    fun destroy() {
        pending.keys.toList().forEach { abortSave(it) }
    }
}
