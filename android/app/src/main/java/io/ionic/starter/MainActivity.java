package io.ionic.starter;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;

import io.radar.sdk.Radar;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        Radar.initialize(this, "prj_test_pk_7e81b4d30093ee9b0f8d347be3e454fd8069acc2");

        super.onCreate(savedInstanceState);
    }
}
