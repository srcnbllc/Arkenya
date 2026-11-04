package com.mythic.jewels;

import android.os.Bundle;
import android.view.View;
import android.view.WindowManager;
import android.webkit.WebSettings;
import android.webkit.WebView;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // Keep display awake during active gameplay
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);

        // Crucial for Android Emulator & Mobile WebView 60FPS performance and audio playback:
        try {
            WebView webView = getBridge().getWebView();
            if (webView != null) {
                webView.setVerticalScrollBarEnabled(false);
                webView.setHorizontalScrollBarEnabled(false);
                webView.setOverScrollMode(View.OVER_SCROLL_NEVER);
                // Allow natural hardware-accelerated composition; avoiding offscreen LAYER_TYPE_HARDWARE eliminates Davey stalls & ANR in emulators/devices
                webView.setLayerType(View.LAYER_TYPE_NONE, null);

                WebSettings settings = webView.getSettings();
                settings.setMediaPlaybackRequiresUserGesture(false);
                settings.setAllowFileAccess(true);
                settings.setAllowContentAccess(true);
                settings.setDomStorageEnabled(true);
                settings.setDatabaseEnabled(true);
                settings.setCacheMode(WebSettings.LOAD_DEFAULT);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
