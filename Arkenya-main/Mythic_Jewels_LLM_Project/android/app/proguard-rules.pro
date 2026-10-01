# Add project specific ProGuard rules here.
# You can control the set of applied configuration files using the
# proguardFiles setting in build.gradle.

# Preserve Capacitor & WebView JavaScript Interfaces
-keepattributes JavascriptInterface
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

-keep class com.getcapacitor.** { *; }
-keep interface com.getcapacitor.** { *; }

# Google Play Services & AdMob
-keep class com.google.android.gms.ads.** { *; }
-keep interface com.google.android.gms.ads.** { *; }
-dontwarn com.google.android.gms.**

# AndroidX Core & Splashscreen
-keep class androidx.core.splashscreen.** { *; }

# Preserve line numbers and source file names for production crash reports
-keepattributes SourceFile,LineNumberTable
-renamesourcefileattribute SourceFile
