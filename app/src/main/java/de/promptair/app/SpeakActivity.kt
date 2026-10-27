package de.promptair.app

import android.content.Intent
import android.os.Bundle
import android.widget.ArrayAdapter
import android.widget.Button
import android.widget.EditText
import android.widget.SeekBar
import android.widget.Spinner
import android.widget.TextView
import android.widget.Toast
import androidx.core.content.FileProvider
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.updatePadding
import de.promptair.app.tts.SystemTtsEngine
import de.promptair.app.tts.VoiceInfo
import java.io.File

/**
 * Text mit der Sprachausgabe des Geräts vorlesen lassen und als WAV exportieren.
 * Wird aus dem Editor mit dem aktuellen Skript geöffnet.
 */
class SpeakActivity : LocalizedActivity() {

    companion object {
        const val EXTRA_TITLE = "title"
        const val EXTRA_TEXT = "text"
        const val EXTRA_LANG = "lang"
    }

    private lateinit var system: SystemTtsEngine
    private var voiceList: List<VoiceInfo> = emptyList()
    private var rate = 1.0f

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_speak)
        supportActionBar?.setDisplayHomeAsUpEnabled(true)

        val root = findViewById<android.view.View>(R.id.speakRoot)
        ViewCompat.setOnApplyWindowInsetsListener(root) { v, insets ->
            val b = insets.getInsets(WindowInsetsCompat.Type.navigationBars() or WindowInsetsCompat.Type.ime())
            v.updatePadding(bottom = b.bottom + (20 * resources.displayMetrics.density).toInt())
            insets
        }

        intent.getStringExtra(EXTRA_TITLE)?.takeIf { it.isNotBlank() }?.let { supportActionBar?.subtitle = it }

        val spinner = findViewById<Spinner>(R.id.spVoice)
        val input = findViewById<EditText>(R.id.edText)
        val rateLabel = findViewById<TextView>(R.id.txtRate)
        if (savedInstanceState == null) {
            // Regieanweisungen <…> und **Hervorhebungen** sind fürs Vorlesen nicht gedacht
            input.setText(
                (intent.getStringExtra(EXTRA_TEXT) ?: "")
                    .replace(Regex("<[^>]*>"), "")
                    .replace("**", "")
            )
        }

        // Stimmen in der Sprache des Skripts (= Sprache der Spracherkennung im Prompter)
        val speechLang = intent.getStringExtra(EXTRA_LANG)?.takeIf { it.isNotBlank() } ?: "de-DE"
        system = SystemTtsEngine(this, speechLang) {
            runOnUiThread {
                voiceList = system.voices()
                spinner.adapter = ArrayAdapter(
                    this, android.R.layout.simple_spinner_dropdown_item,
                    if (voiceList.isEmpty()) listOf(getString(R.string.no_voices)) else voiceList.map { it.label }
                )
            }
        }

        findViewById<SeekBar>(R.id.seekRate).setOnSeekBarChangeListener(object : SeekBar.OnSeekBarChangeListener {
            override fun onProgressChanged(sb: SeekBar?, p: Int, u: Boolean) {
                rate = 0.5f + p / 100f * 1.5f
                rateLabel.text = getString(R.string.rate_label, rate)
            }
            override fun onStartTrackingTouch(sb: SeekBar?) {}
            override fun onStopTrackingTouch(sb: SeekBar?) {}
        })

        findViewById<Button>(R.id.btnSay).setOnClickListener {
            val v = voiceList.getOrNull(spinner.selectedItemPosition) ?: return@setOnClickListener
            system.stop()
            system.speak(input.text.toString(), v.id, rate) {}
        }
        findViewById<Button>(R.id.btnStop).setOnClickListener { system.stop() }

        findViewById<Button>(R.id.btnExport).setOnClickListener {
            val v = voiceList.getOrNull(spinner.selectedItemPosition) ?: return@setOnClickListener
            val out = File(File(cacheDir, "exports"), "PromptAir_${System.currentTimeMillis()}.wav")
            out.parentFile?.mkdirs()
            system.synthesizeToFile(input.text.toString(), v.id, rate, out) { ok ->
                runOnUiThread {
                    if (!ok) { Toast.makeText(this, R.string.export_failed, Toast.LENGTH_SHORT).show(); return@runOnUiThread }
                    val uri = FileProvider.getUriForFile(this, "$packageName.files", out)
                    startActivity(Intent.createChooser(Intent(Intent.ACTION_SEND).apply {
                        type = "audio/wav"
                        putExtra(Intent.EXTRA_STREAM, uri)
                        addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
                    }, getString(R.string.share_audio)))
                }
            }
        }
    }

    override fun onSupportNavigateUp(): Boolean { finish(); return true }

    override fun onDestroy() {
        system.release()
        super.onDestroy()
    }
}
