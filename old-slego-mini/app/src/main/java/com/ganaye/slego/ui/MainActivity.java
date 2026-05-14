package com.ganaye.slego.ui;

import android.app.Activity;
import android.os.Bundle;
import android.os.Handler;
import android.util.Log;

import com.ganaye.slego.SlegoApp;

public class MainActivity extends Activity {
    SlegoApp app;
    Handler handler = new Handler();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        app = (SlegoApp) this.getApplication();
        app.onMainActivityCreated(this);
    }


    @Override
    public void onBackPressed() {
        app.onBackPressed();
    }

    @Override
    protected void onDestroy() {
        app.onMainActivityDestroyed(this);
        super.onDestroy();
    }

    @Override
    protected void onPause() {
        super.onPause();
        app.onMainActivityPaused(this);
    }

    @Override
    protected void onResume() {
        Log.d("AAA", "MainActivity.onResume()");
        super.onResume();
        app.onMainActivityResumed(this);
    }
}