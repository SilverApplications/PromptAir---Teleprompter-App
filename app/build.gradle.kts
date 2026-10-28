plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

android {
    // Paketname im Code bleibt de.promptair.app (namespace).
    // Die applicationId ist die dauerhafte ID im Play Store – siehe README, Abschnitt "Vor dem Upload".
    namespace = "de.promptair.app"
    compileSdk = 36

    defaultConfig {
        applicationId = "com.silverapplications.promptair"
        minSdk = 29          // Android 10: MediaStore ohne Speicherberechtigung
        targetSdk = 36       // Pflicht für Google Play seit 31.08.2026
        versionCode = 4
        versionName = "1.2.0"
    }

    buildTypes {
        release {
            // Seit 1.2.0: R8 entfernt ungenutzten Bibliothekscode. Damit verschwinden die
            // veralteten Systemleisten-Aufrufe aus Material (BottomSheetDialog, SheetDialog,
            // EdgeToEdgeUtils), die PromptAir nicht nutzt, und die App wird kleiner.
            // Die Zuordnungsdatei (mapping.txt) steckt automatisch im App-Bundle.
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    buildFeatures {
        buildConfig = true
    }
}

kotlin {
    compilerOptions {
        jvmTarget.set(org.jetbrains.kotlin.gradle.dsl.JvmTarget.JVM_17)
    }
}

dependencies {
    implementation("androidx.core:core-ktx:1.17.0")
    implementation("androidx.appcompat:appcompat:1.7.1")
    implementation("androidx.activity:activity-ktx:1.11.0")
    implementation("com.google.android.material:material:1.13.0")
    implementation("androidx.webkit:webkit:1.14.0")
}
