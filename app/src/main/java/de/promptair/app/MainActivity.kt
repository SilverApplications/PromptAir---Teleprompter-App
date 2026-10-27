package de.promptair.app

import android.Manifest
import android.annotation.SuppressLint
import android.content.ActivityNotFoundException
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Bundle
import android.view.ViewGroup
import android.webkit.PermissionRequest
import android.webkit.ValueCallback
import android.webkit.WebChromeClient
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.FrameLayout
import androidx.activity.OnBackPressedCallback
import androidx.activity.SystemBarStyle
import androidx.activity.enableEdgeToEdge
import androidx.activity.result.contract.ActivityResultContracts
import androidx.core.content.ContextCompat
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import androidx.webkit.WebViewAssetLoader
import org.json.JSONObject

/**
 * Hostet den Web-Prompter (assets/promptair.html) in einem WebView.
 *
 * - WebViewAssetLoader liefert die Seite unter https://appassets.androidplatform.net
 *   aus (sicherer Kontext -> Kamera/Mikrofon funktionieren).
 * - [SpeechBridge] ersetzt die im WebView fehlende Web Speech API.
 * - [AppBridge] schließt die übrigen WebView-Lücken: Speichern, Export ("Speichern unter"),
 *   Wachhalten, Vollbild, Sprache, Vorlesen, Lizenzen.
 * - Zurück-Taste und Datei-Import werden hier nativ behandelt.
 */
class MainActivity : LocalizedActivity() {

    private lateinit var web: WebView
    private lateinit var speech: SpeechBridge
    private lateinit var app: AppBridge
    private var pendingWebPermission: PermissionRequest? = null
    private var fileCallback: ValueCallback<Array<Uri>>? = null

    private val askPermissions = registerForActivityResult(
        ActivityResultContracts.RequestMultiplePermissions()
    ) { grants ->
        pendingWebPermission?.let { req ->
            if (grants.values.all { it }) req.grant(req.resources) else req.deny()
            pendingWebPermission = null
        }
        if (grants[Manifest.permission.RECORD_AUDIO] == true) speech.onPermissionGranted()
    }

    /** Skript-Export: Android-Dialog "Speichern unter" – Nutzer wählt Ort und Namen frei. */
    private var pendingExport: String? = null
    private val createDoc = registerForActivityResult(
        ActivityResultContracts.CreateDocument("text/plain")
    ) { uri ->
        val text = pendingExport
        pendingExport = null
        if (uri == null || text == null) { webEvent("export_cancel"); return@registerForActivityResult }
        val ok = runCatching {
            contentResolver.openOutputStream(uri, "wt")?.use { it.write(text.toByteArray(Charsets.UTF_8)) }
                ?: error("kein Ausgabestrom")
        }.isSuccess
        webEvent(if (ok) "export_ok" else "export_failed")
    }

    fun startExport(fileName: String, text: String) {
        pendingExport = text
        val name = fileName.replace(Regex("[\\\\/:*?\"<>|]"), "_").ifBlank { "PromptAir.txt" }
        try {
            createDoc.launch(if (name.endsWith(".txt", true)) name else "$name.txt")
        } catch (e: ActivityNotFoundException) {
            pendingExport = null
            webEvent("export_failed")
        }
    }

    /** Statusmeldung an die Seite; die übersetzt die Kennung. */
    fun webEvent(code: String) {
        if (!::web.isInitialized) return
        web.evaluateJavascript("window.__promptairEvent && window.__promptairEvent(${JSONObject.quote(code)});", null)
    }

    /** Datei-Import (<input type="file">) – im WebView sonst wirkungslos. */
    private val pickFile = registerForActivityResult(
        ActivityResultContracts.OpenDocument()
    ) { uri ->
        fileCallback?.onReceiveValue(if (uri != null) arrayOf(uri) else null)
        fileCallback = null
    }

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        // Ab API 35 ist Edge-to-Edge Pflicht: dunkle Systemleisten, Inhalt per Insets einrücken
        enableEdgeToEdge(
            statusBarStyle = SystemBarStyle.dark(android.graphics.Color.TRANSPARENT),
            navigationBarStyle = SystemBarStyle.dark(android.graphics.Color.TRANSPARENT)
        )
        super.onCreate(savedInstanceState)

        val root = FrameLayout(this).apply {
            setBackgroundColor(ContextCompat.getColor(this@MainActivity, R.color.anthrazit_900))
        }
        web = WebView(this).apply { setBackgroundColor(ContextCompat.getColor(context, R.color.anthrazit_900)) }
        root.addView(web, ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT)
        setContentView(root)

        // Systemleisten + Kamera-Aussparung als Abstand; im Vollbild sind die Leisten ausgeblendet -> 0
        ViewCompat.setOnApplyWindowInsetsListener(root) { v, insets ->
            val bars = insets.getInsets(
                WindowInsetsCompat.Type.systemBars() or
                    WindowInsetsCompat.Type.displayCutout() or
                    WindowInsetsCompat.Type.ime()
            )
            v.setPadding(bars.left, bars.top, bars.right, bars.bottom)
            WindowInsetsCompat.CONSUMED
        }

        speech = SpeechBridge(this, web) { needsPermission ->
            if (needsPermission) askPermissions.launch(arrayOf(Manifest.permission.RECORD_AUDIO))
        }
        app = AppBridge(this, web)

        val assetLoader = WebViewAssetLoader.Builder()
            .addPathHandler("/assets/", WebViewAssetLoader.AssetsPathHandler(this))
            .build()

        web.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            mediaPlaybackRequiresUserGesture = false
            allowFileAccess = false
            allowContentAccess = false
            setSupportMultipleWindows(false)
        }
        web.addJavascriptInterface(speech, "AndroidSpeech")
        web.addJavascriptInterface(app, "AndroidApp")

        web.webViewClient = object : WebViewClient() {
            override fun shouldInterceptRequest(
                view: WebView, request: WebResourceRequest
            ): WebResourceResponse? = assetLoader.shouldInterceptRequest(request.url)

            /** Alles außerhalb der App (Impressum, Datenschutz, Quellcode) im Browser öffnen. */
            override fun shouldOverrideUrlLoading(view: WebView, request: WebResourceRequest): Boolean {
                val url = request.url
                if (url.host == "appassets.androidplatform.net") return false
                openExternal(url)
                return true
            }
        }

        web.webChromeClient = object : WebChromeClient() {
            override fun onPermissionRequest(request: PermissionRequest) {
                val needed = mutableListOf<String>()
                request.resources.forEach { res ->
                    when (res) {
                        PermissionRequest.RESOURCE_AUDIO_CAPTURE ->
                            if (!has(Manifest.permission.RECORD_AUDIO)) needed += Manifest.permission.RECORD_AUDIO
                        PermissionRequest.RESOURCE_VIDEO_CAPTURE ->
                            if (!has(Manifest.permission.CAMERA)) needed += Manifest.permission.CAMERA
                    }
                }
                if (needed.isEmpty()) {
                    runOnUiThread { request.grant(request.resources) }
                } else {
                    pendingWebPermission = request
                    askPermissions.launch(needed.toTypedArray())
                }
            }

            override fun onShowFileChooser(
                view: WebView,
                callback: ValueCallback<Array<Uri>>,
                params: FileChooserParams
            ): Boolean {
                fileCallback?.onReceiveValue(null)
                fileCallback = callback
                return try {
                    pickFile.launch(arrayOf("text/plain", "text/markdown", "text/*"))
                    true
                } catch (e: ActivityNotFoundException) {
                    fileCallback = null
                    false
                }
            }
        }

        // Zurück-Taste: erst die Seite fragen (Einstellungen schließen, Prompter verlassen …)
        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                web.evaluateJavascript(
                    "(window.__promptairBack && window.__promptairBack()) ? 'y' : 'n'"
                ) { handled ->
                    if (handled?.contains("y") != true) {
                        isEnabled = false
                        onBackPressedDispatcher.onBackPressed()
                        isEnabled = true
                    }
                }
            }
        })

        if (savedInstanceState != null) web.restoreState(savedInstanceState)
        else web.loadUrl("https://appassets.androidplatform.net/assets/promptair.html")
    }

    private fun openExternal(url: Uri) {
        try {
            startActivity(Intent(Intent.ACTION_VIEW, url))
        } catch (_: ActivityNotFoundException) { /* kein Browser installiert */ }
    }

    private fun has(p: String) =
        ContextCompat.checkSelfPermission(this, p) == PackageManager.PERMISSION_GRANTED

    override fun onSaveInstanceState(outState: Bundle) {
        super.onSaveInstanceState(outState)
        web.saveState(outState)
    }

    override fun onPause() {
        // Spracherkennung nicht im Hintergrund weiterlaufen lassen
        speech.pauseForBackground()
        super.onPause()
    }

    override fun onResume() {
        super.onResume()
        speech.resumeFromBackground()
    }

    override fun onDestroy() {
        speech.destroy()
        app.destroy()
        web.destroy()
        super.onDestroy()
    }
}
