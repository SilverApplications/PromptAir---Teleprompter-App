# Nur relevant, falls R8 später aktiviert wird.
# JS-Bridges (WebView) nicht wegoptimieren
-keepclassmembers class * { @android.webkit.JavascriptInterface <methods>; }