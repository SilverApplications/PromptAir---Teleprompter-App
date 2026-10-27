package de.promptair.app.tts

import android.content.Context
import android.speech.tts.TextToSpeech
import android.speech.tts.UtteranceProgressListener
import android.speech.tts.Voice
import java.io.File
import java.util.Locale

/**
 * Gemeinsame Schnittstelle aller Sprachsynthese-Backends.
 * Der Rest der App kennt nur dieses Interface - weitere Engines lassen sich
 * spaeter ergaenzen, ohne den uebrigen Code anzufassen.
 */
interface TtsEngine {
    /** Verfuegbare Stimmen dieses Backends. */
    fun voices(): List<VoiceInfo>

    /** Spricht den Text direkt. [rate] 0.5..2.0. */
    fun speak(text: String, voiceId: String, rate: Float, onDone: () -> Unit)

    /** Synthese in eine WAV-Datei (fuer Export). */
    fun synthesizeToFile(text: String, voiceId: String, rate: Float, target: File, onDone: (Boolean) -> Unit)

    fun stop()
    fun release()
}

data class VoiceInfo(val id: String, val label: String, val engine: String)

/**
 * Backend 1: Android-System-TTS.
 * Nutzt die auf dem Geraet installierten Offline-Stimmen der gewuenschten Sprache
 * ([languageTag], z. B. "de-DE", "en-US", "es-ES").
 */
class SystemTtsEngine(
    context: Context,
    languageTag: String,
    private val onReady: () -> Unit
) : TtsEngine {

    private val wanted: Locale = Locale.forLanguageTag(languageTag)
    private val uiLocale: Locale = context.resources.configuration.locales[0]

    private var ready = false
    private val tts: TextToSpeech = TextToSpeech(context) { status ->
        if (status == TextToSpeech.SUCCESS) {
            tts.language = wanted
            ready = true
            onReady()
        }
    }

    override fun voices(): List<VoiceInfo> {
        if (!ready) return emptyList()
        return tts.voices
            ?.filter { it.locale.language == wanted.language && !it.isNetworkConnectionRequired }
            // Stimmen der genauen Region (z. B. de-DE vor de-AT) zuerst
            ?.sortedWith(compareBy({ it.locale.country != wanted.country }, { it.name }))
            ?.map { VoiceInfo(it.name, prettyName(it), "System-TTS (offline)") }
            ?: emptyList()
    }

    private fun prettyName(v: Voice): String {
        // Google benennt Stimmen kryptisch (de-DE-x-deb-local etc.) und verraet
        // das Geschlecht nicht per API - daher Sprache/Region + Kurzname anzeigen.
        val region = v.locale.getDisplayName(uiLocale).replaceFirstChar { it.titlecase(uiLocale) }
        return "$region · ${v.name.substringAfterLast("x-").substringBefore("-").uppercase()}"
    }

    override fun speak(text: String, voiceId: String, rate: Float, onDone: () -> Unit) {
        applyVoice(voiceId, rate)
        tts.setOnUtteranceProgressListener(object : UtteranceProgressListener() {
            override fun onDone(utteranceId: String?) = onDone()
            override fun onError(utteranceId: String?) = onDone()
            override fun onStart(utteranceId: String?) {}
        })
        // [pause]-Marker in echte Stille uebersetzen
        val parts = text.split(Regex("\\[pause( lang)?]"))
        val longPause = Regex("\\[pause lang]")
        var cursor = 0
        parts.forEachIndexed { i, part ->
            if (part.isNotBlank()) {
                tts.speak(part.trim(), TextToSpeech.QUEUE_ADD, null, "u$i")
            }
            if (i < parts.size - 1) {
                cursor += part.length
                val isLong = longPause.find(text, cursor) ?. range?.first == cursor
                tts.playSilentUtterance(if (isLong) 1200 else 500, TextToSpeech.QUEUE_ADD, "p$i")
                cursor += if (isLong) 12 else 7
            }
        }
    }

    override fun synthesizeToFile(text: String, voiceId: String, rate: Float, target: File, onDone: (Boolean) -> Unit) {
        applyVoice(voiceId, rate)
        tts.setOnUtteranceProgressListener(object : UtteranceProgressListener() {
            override fun onDone(utteranceId: String?) = onDone(true)
            override fun onError(utteranceId: String?) = onDone(false)
            override fun onStart(utteranceId: String?) {}
        })
        tts.synthesizeToFile(text.replace(Regex("\\[pause( lang)?]"), ","), null, target, "file")
    }

    private fun applyVoice(voiceId: String, rate: Float) {
        tts.voices?.firstOrNull { it.name == voiceId }?.let { tts.voice = it }
        tts.setSpeechRate(rate)
    }

    override fun stop() { tts.stop() }
    override fun release() { tts.shutdown() }
}
