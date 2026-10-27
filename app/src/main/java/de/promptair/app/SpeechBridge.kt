package de.promptair.app

import android.Manifest
import android.app.Activity
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.speech.RecognitionListener
import android.speech.RecognizerIntent
import android.speech.SpeechRecognizer
import android.webkit.JavascriptInterface
import android.webkit.WebView
import androidx.core.content.ContextCompat
import org.json.JSONObject

/**
 * Brücke zwischen Web-Prompter und nativer Android-Spracherkennung.
 *
 * Die Seite ruft AndroidSpeech.start(lang) / AndroidSpeech.stop() auf;
 * erkannte (Teil-)Sätze gehen per window.__onSpeech(text, isFinal) zurück.
 * Statusmeldungen gehen als Kennung an window.__promptairEvent(code) –
 * die Seite übersetzt sie in die gewählte Sprache.
 *
 * Datenschutz-Reihenfolge:
 *  1. Ab Android 12: On-Device-Erkenner (Audio verlässt das Gerät nicht).
 *  2. Fehlt das Offline-Sprachpaket: Standard-Erkenner mit "offline bevorzugt" –
 *     kann online über Google laufen; der Nutzer bekommt dazu einen Hinweis.
 */
class SpeechBridge(
    private val activity: Activity,
    private val web: WebView,
    private val requestPermission: (Boolean) -> Unit
) {
    private val main = Handler(Looper.getMainLooper())
    private var recognizer: SpeechRecognizer? = null
    private var active = false
    private var pausedByBackground = false
    private var lang = "de-DE"

    /** true nur, wenn die SPRACHERKENNUNG selbst die Mikrofon-Berechtigung angefragt hat. */
    private var awaitingPermission = false

    private var useOnDevice: Boolean? = null
    private var modeAnnounced = false

    @JavascriptInterface
    fun start(language: String) {
        main.post {
            lang = language.ifBlank { "de-DE" }
            if (ContextCompat.checkSelfPermission(activity, Manifest.permission.RECORD_AUDIO)
                != PackageManager.PERMISSION_GRANTED
            ) {
                awaitingPermission = true
                requestPermission(true)
                return@post
            }
            active = true
            startListening()
        }
    }

    @JavascriptInterface
    fun stop() {
        main.post {
            active = false
            awaitingPermission = false
            release()
        }
    }

    @JavascriptInterface
    fun mode(): String = when (useOnDevice) {
        true -> "offline"
        false -> "online"
        null -> if (canOnDevice()) "offline" else if (SpeechRecognizer.isRecognitionAvailable(activity)) "online" else "none"
    }

    /**
     * Wird nach jeder erteilten Mikrofon-Berechtigung aufgerufen.
     * Fix 1.1.0: startet nur, wenn die Spracherkennung die Anfrage ausgelöst hat –
     * vorher lief sie nach einer Kamera-Freigabe unsichtbar mit und belegte das Mikrofon.
     */
    fun onPermissionGranted() {
        main.post {
            if (!awaitingPermission) return@post
            awaitingPermission = false
            active = true
            startListening()
        }
    }

    fun pauseForBackground() {
        main.post {
            if (active) { pausedByBackground = true; active = false; release() }
        }
    }

    fun resumeFromBackground() {
        main.post {
            if (pausedByBackground) { pausedByBackground = false; active = true; startListening() }
        }
    }

    private fun canOnDevice(): Boolean =
        Build.VERSION.SDK_INT >= Build.VERSION_CODES.S &&
            SpeechRecognizer.isOnDeviceRecognitionAvailable(activity)

    private fun startListening() {
        if (!active) return
        if (useOnDevice == null) useOnDevice = canOnDevice()

        if (useOnDevice == false && !SpeechRecognizer.isRecognitionAvailable(activity)) {
            event("sr_missing")
            active = false
            return
        }
        announceModeOnce()

        release()
        val r = if (useOnDevice == true && Build.VERSION.SDK_INT >= Build.VERSION_CODES.S)
            SpeechRecognizer.createOnDeviceSpeechRecognizer(activity)
        else
            SpeechRecognizer.createSpeechRecognizer(activity)
        recognizer = r
        r.setRecognitionListener(listener)
        r.startListening(buildIntent())
    }

    private fun buildIntent() = Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH).apply {
        putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM)
        putExtra(RecognizerIntent.EXTRA_LANGUAGE, lang)
        putExtra(RecognizerIntent.EXTRA_PARTIAL_RESULTS, true)
        putExtra(RecognizerIntent.EXTRA_MAX_RESULTS, 1)
        putExtra(RecognizerIntent.EXTRA_PREFER_OFFLINE, true)
    }

    private fun announceModeOnce() {
        if (modeAnnounced) return
        modeAnnounced = true
        event(if (useOnDevice == true) "sr_offline" else "sr_online")
    }

    /** Offline-Paket fehlt -> auf Standard-Erkenner wechseln und Paket-Download anstoßen. */
    private fun fallBackToStandard() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            runCatching { recognizer?.triggerModelDownload(buildIntent()) }
        }
        useOnDevice = false
        modeAnnounced = false
        main.postDelayed({ startListening() }, 150)
    }

    private val listener = object : RecognitionListener {
        override fun onPartialResults(partialResults: Bundle) {
            firstResult(partialResults)?.let { send(it, false) }
        }

        override fun onResults(results: Bundle) {
            firstResult(results)?.let { send(it, true) }
            if (active) main.postDelayed({ startListening() }, 120)
        }

        override fun onError(error: Int) {
            if (!active) return
            if (useOnDevice == true && isLanguageError(error)) { fallBackToStandard(); return }
            main.postDelayed({ startListening() }, if (error == SpeechRecognizer.ERROR_RECOGNIZER_BUSY) 600 else 250)
        }

        override fun onReadyForSpeech(params: Bundle?) {}
        override fun onBeginningOfSpeech() {}
        override fun onRmsChanged(rmsdB: Float) {}
        override fun onBufferReceived(buffer: ByteArray?) {}
        override fun onEndOfSpeech() {}
        override fun onEvent(eventType: Int, params: Bundle?) {}
    }

    private fun isLanguageError(error: Int): Boolean =
        Build.VERSION.SDK_INT >= Build.VERSION_CODES.S &&
            (error == SpeechRecognizer.ERROR_LANGUAGE_NOT_SUPPORTED ||
                error == SpeechRecognizer.ERROR_LANGUAGE_UNAVAILABLE)

    private fun firstResult(b: Bundle): String? =
        b.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION)?.firstOrNull()

    private fun send(text: String, isFinal: Boolean) {
        val safe = JSONObject.quote(text)
        web.evaluateJavascript("window.__onSpeech && window.__onSpeech($safe, $isFinal);", null)
    }

    private fun event(code: String) {
        val safe = JSONObject.quote(code)
        web.evaluateJavascript("window.__promptairEvent && window.__promptairEvent($safe);", null)
    }

    private fun release() {
        recognizer?.let { runCatching { it.cancel(); it.destroy() } }
        recognizer = null
    }

    fun destroy() {
        active = false
        release()
    }
}
