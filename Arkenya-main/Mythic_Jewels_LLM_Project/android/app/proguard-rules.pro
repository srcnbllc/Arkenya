# ==============================================================================
# Arkenya Mythic Jewels - Production ProGuard / R8 Rules
# Target: Android API 36 | R8 De-obfuscation & Stack Trace Preservation
# ==============================================================================

# --- Line Numbers & Source File Mapping (Google Play Console De-obfuscation) ---
-keepattributes SourceFile,LineNumberTable
-renamesourcefileattribute SourceFile

# --- Annotations, Exceptions & Generic Signatures ---
-keepattributes *Annotation*,Signature,InnerClasses,EnclosingMethod,Exceptions

# --- Capacitor Core & Bridge ---
-keep class com.getcapacitor.** { *; }
-keep interface com.getcapacitor.** { *; }
-keepclassmembers class * extends com.getcapacitor.Plugin {
    public <methods>;
}
-keep class * extends com.getcapacitor.Bridge { *; }
-keep class * extends com.getcapacitor.Plugin { *; }
-dontwarn com.getcapacitor.**

# --- WebView & JavaScript Interface Bridges ---
-keepattributes JavascriptInterface
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}
-keep class android.webkit.** { *; }
-dontwarn android.webkit.**

# --- Cordova Compatibility Layer ---
-keep class org.apache.cordova.** { *; }
-keep interface org.apache.cordova.** { *; }
-dontwarn org.apache.cordova.**

# --- AndroidX Core, AppCompat & Splashscreen ---
-keep class androidx.appcompat.** { *; }
-keep class androidx.core.splashscreen.** { *; }
-dontwarn androidx.**

# --- Native JNI Method Declarations ---
-keepclasseswithmembernames class * {
    native <methods>;
}

# --- Keep Public Classes & Static Initializers for Reflection ---
-keepclassmembers enum * {
    public static **[] values();
    public static ** valueOf(java.lang.String);
}
