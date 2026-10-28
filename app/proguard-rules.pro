# R8-Regeln für PromptAir (aktiv seit 1.2.0)

# JS-Bridges (WebView): Methoden, die die Web-Oberfläche aufruft, müssen samt Namen erhalten bleiben
-keepclassmembers class * { @android.webkit.JavascriptInterface <methods>; }
-keepattributes JavascriptInterface

# Lesbare Absturzberichte in der Play Console (Zeilennummern, Dateinamen werden über mapping.txt aufgelöst)
-keepattributes SourceFile,LineNumberTable
-renamesourcefileattribute SourceFile
