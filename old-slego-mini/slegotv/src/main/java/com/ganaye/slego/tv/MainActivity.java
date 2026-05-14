package com.ganaye.slego.tv;

import android.app.Activity;
import android.os.Bundle;
import android.util.Log;
import android.view.KeyEvent;
import android.widget.TextView;

/*
 * Main Activity class that loads {@link MainFragment}.
 */
public class MainActivity extends Activity {
    final static String TAG = "MainActivity";
    private TextView textView;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        //setContentView(R.layout.activity_main);
        textView = new TextView(this);
        textView.setText("Hello TV");
        setContentView(textView);
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        textView.setText("Key " + keyCode+ " down");
        return super.onKeyDown(keyCode, event);
    }

    @Override
    public boolean onKeyUp(int keyCode, KeyEvent event) {
        textView.setText("Key " + keyCode+ " up");
        return super.onKeyUp(keyCode, event);
    }
}
