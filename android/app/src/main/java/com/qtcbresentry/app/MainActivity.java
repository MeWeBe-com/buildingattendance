package com.qtcbresentry.app;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;

import io.radar.sdk.Radar;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        Radar.initialize(this, "prj_test_pk_9dd735029a99e7a85cffbe7320c82276f56cfc27");

        super.onCreate(savedInstanceState);
    }
}
