package de.promptair.app

import android.content.Context
import android.content.res.Configuration
import android.os.LocaleList
import androidx.appcompat.app.AppCompatActivity
import java.util.Locale

/**
 * Sprache der nativen Bildschirme (Vorlesen, Lizenzen).
 * Die Web-Oberfläche wählt ihre Sprache selbst und meldet sie über
 * AndroidApp.setLanguage() hierher, damit native Texte dazu passen.
 */
object LocaleHelper {
    private const val PREFS = "promptair"
    private const val KEY = "ui_lang"
    val SUPPORTED = setOf("de", "en", "es", "fr", "pt", "it")

    fun save(context: Context, lang: String) {
        context.getSharedPreferences(PREFS, Context.MODE_PRIVATE).edit()
            .putString(KEY, lang.takeIf { it in SUPPORTED } ?: "").apply()
    }

    /** Gespeicherte Sprache oder "" (= Gerätesprache). */
    fun current(context: Context): String =
        context.getSharedPreferences(PREFS, Context.MODE_PRIVATE).getString(KEY, "") ?: ""

    /** Sprache, die tatsächlich angezeigt wird (für ?lang= der Lizenzseite). */
    fun effective(context: Context): String =
        current(context).ifBlank {
            context.resources.configuration.locales[0].language.takeIf { it in SUPPORTED } ?: "en"
        }

    fun wrap(base: Context): Context {
        val lang = current(base)
        if (lang.isBlank()) return base
        val locale = Locale.forLanguageTag(lang)
        val config = Configuration(base.resources.configuration)
        config.setLocales(LocaleList(locale))
        return base.createConfigurationContext(config)
    }
}

/** Basisklasse: native Bildschirme in der in PromptAir gewählten Sprache. */
abstract class LocalizedActivity : AppCompatActivity() {
    override fun attachBaseContext(newBase: Context) {
        super.attachBaseContext(LocaleHelper.wrap(newBase))
    }
}
