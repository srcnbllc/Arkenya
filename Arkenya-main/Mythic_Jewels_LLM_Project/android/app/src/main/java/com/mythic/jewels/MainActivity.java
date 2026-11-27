package com.mythic.jewels;

import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.speech.tts.TextToSpeech;
import android.view.View;
import android.view.WindowInsets;
import android.view.WindowInsetsController;
import android.view.WindowManager;
import android.webkit.JavascriptInterface;
import android.webkit.WebSettings;
import android.webkit.WebView;
import java.util.Locale;
import androidx.activity.OnBackPressedCallback;
import com.getcapacitor.BridgeActivity;
import com.google.android.play.core.appupdate.AppUpdateInfo;
import com.google.android.play.core.appupdate.AppUpdateManager;
import com.google.android.play.core.appupdate.AppUpdateManagerFactory;
import com.google.android.play.core.install.InstallStateUpdatedListener;
import com.google.android.play.core.install.model.AppUpdateType;
import com.google.android.play.core.install.model.InstallStatus;
import com.google.android.play.core.install.model.UpdateAvailability;

public class MainActivity extends BridgeActivity {
    private static final int FLEXIBLE_UPDATE_REQUEST_CODE = 9988;
    private AppUpdateManager appUpdateManager;
    private InstallStateUpdatedListener installStateUpdatedListener;
    private TextToSpeech nativeTts;
    private boolean isTtsReady = false;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // Keep display awake during active gameplay
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);

        // Edge-to-Edge Display Cutout Adaptation (Portrait & Landscape on Android 9-15)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
            WindowManager.LayoutParams lp = getWindow().getAttributes();
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
                lp.layoutInDisplayCutoutMode = WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_ALWAYS;
            } else {
                lp.layoutInDisplayCutoutMode = WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_SHORT_EDGES;
            }
            getWindow().setAttributes(lp);
        }

        // Native Android App: Immersive Sticky Fullscreen (Edge-to-Edge)
        applyImmersiveSticky();

        // Android 13-15 Native Predictive & System Back Navigation Callback
        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                try {
                    WebView webView = getBridge().getWebView();
                    if (webView != null) {
                        webView.post(() -> {
                            webView.evaluateJavascript(
                                "if (typeof window.handleAndroidBackButton === 'function') { " +
                                "  window.handleAndroidBackButton(); " +
                                "} else { " +
                                "  window.history.back(); " +
                                "}",
                                null
                            );
                        });
                    }
                } catch (Exception e) {
                    finish();
                }
            }
        });

        // Pure Native Android WebView settings
        try {
            WebView webView = getBridge().getWebView();
            if (webView != null) {
                webView.setVerticalScrollBarEnabled(false);
                webView.setHorizontalScrollBarEnabled(false);
                webView.setOverScrollMode(View.OVER_SCROLL_NEVER);
                // Hardware layer managed via AndroidManifest hardwareAccelerated="true" (legacy: webView.setLayerType(View.LAYER_TYPE_HARDWARE, null);)
                webView.setLayerType(View.LAYER_TYPE_NONE, null);

                WebSettings settings = webView.getSettings();
                settings.setMediaPlaybackRequiresUserGesture(false);
                settings.setAllowFileAccess(true);
                settings.setAllowContentAccess(true);
                settings.setDomStorageEnabled(true);
                settings.setDatabaseEnabled(true);
                settings.setCacheMode(WebSettings.LOAD_DEFAULT);

                // Viewport & Zoom Lock
                settings.setSupportZoom(false);
                settings.setBuiltInZoomControls(false);
                settings.setDisplayZoomControls(false);
                settings.setTextZoom(100);

                // Native Android Bilingual (TR / EN) Epic Narrator TTS Fallback Bridge
                initNativeTtsEngine();
                webView.addJavascriptInterface(new AndroidVoiceBridge(), "AndroidNativeTTS");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        // Initialize Google Play Flexible In-App Update Engine
        initGooglePlayFlexibleUpdate();
    }

    private void initGooglePlayFlexibleUpdate() {
        try {
            appUpdateManager = AppUpdateManagerFactory.create(this);
            installStateUpdatedListener = state -> {
                if (state.installStatus() == InstallStatus.DOWNLOADED) {
                    // Notify game webview that flexible update is downloaded in background
                    notifyUpdateDownloadedInWebView();
                }
            };
            appUpdateManager.registerListener(installStateUpdatedListener);

            appUpdateManager.getAppUpdateInfo().addOnSuccessListener(appUpdateInfo -> {
                if (appUpdateInfo.updateAvailability() == UpdateAvailability.UPDATE_AVAILABLE
                        && appUpdateInfo.isUpdateTypeAllowed(AppUpdateType.FLEXIBLE)) {
                    try {
                        appUpdateManager.startUpdateFlowForResult(
                            appUpdateInfo,
                            AppUpdateType.FLEXIBLE,
                            this,
                            FLEXIBLE_UPDATE_REQUEST_CODE
                        );
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            });
        } catch (Exception e) {
            // Graceful fallback for non-Play Store environments
            e.printStackTrace();
        }
    }

    private void notifyUpdateDownloadedInWebView() {
        try {
            WebView webView = getBridge().getWebView();
            if (webView != null) {
                webView.post(() -> {
                    webView.evaluateJavascript("if (typeof window.onFlexibleUpdateDownloaded === 'function') { window.onFlexibleUpdateDownloaded(); }", null);
                });
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void completeFlexibleUpdate() {
        if (appUpdateManager != null) {
            appUpdateManager.completeUpdate();
        }
    }

    @Override
    public void onResume() {
        super.onResume();
        applyImmersiveSticky();
        // Check if an update was already downloaded while backgrounded
        if (appUpdateManager != null) {
            appUpdateManager.getAppUpdateInfo().addOnSuccessListener(appUpdateInfo -> {
                if (appUpdateInfo.installStatus() == InstallStatus.DOWNLOADED) {
                    notifyUpdateDownloadedInWebView();
                }
            });
        }
    }

    private void initNativeTtsEngine() {
        try {
            nativeTts = new TextToSpeech(this, status -> {
                if (status == TextToSpeech.SUCCESS) {
                    isTtsReady = true;
                }
            });
        } catch (Exception ignored) {}
    }

    public class AndroidVoiceBridge {
        @JavascriptInterface
        public void speak(String text, String lang) {
            if (!isTtsReady || nativeTts == null || text == null || text.trim().isEmpty()) return;
            try {
                Locale targetLocale = (lang != null && lang.toLowerCase(Locale.ROOT).startsWith("en"))
                    ? Locale.US
                    : new Locale("tr", "TR");
                nativeTts.setLanguage(targetLocale);
                nativeTts.setPitch(0.84f);
                nativeTts.setSpeechRate(0.88f);
                nativeTts.speak(text, TextToSpeech.QUEUE_FLUSH, null, "arkenya_epic_narrator");
            } catch (Exception ignored) {}
        }

        @JavascriptInterface
        public void stop() {
            if (nativeTts != null) {
                try {
                    nativeTts.stop();
                } catch (Exception ignored) {}
            }
        }
    }

    @Override
    public void onDestroy() {
        if (nativeTts != null) {
            try {
                nativeTts.stop();
                nativeTts.shutdown();
            } catch (Exception ignored) {}
        }
        super.onDestroy();
        if (appUpdateManager != null && installStateUpdatedListener != null) {
            try {
                appUpdateManager.unregisterListener(installStateUpdatedListener);
            } catch (Exception ignored) {}
        }
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus) {
            applyImmersiveSticky();
        }
    }

    private void applyImmersiveSticky() {
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
                WindowInsetsController controller = getWindow().getInsetsController();
                if (controller != null) {
                    controller.hide(WindowInsets.Type.statusBars() | WindowInsets.Type.navigationBars());
                    controller.setSystemBarsBehavior(WindowInsetsController.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE);
                }
            } else {
                View decorView = getWindow().getDecorView();
                if (decorView != null) {
                    decorView.setSystemUiVisibility(
                        View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
                        | View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                        | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                        | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                        | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                        | View.SYSTEM_UI_FLAG_FULLSCREEN
                    );
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
