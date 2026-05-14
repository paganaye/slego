package com.ganaye.slego.ui;

import android.content.Context;
import android.graphics.Color;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;

import static android.widget.LinearLayout.VERTICAL;


public class ScrollLayout extends android.widget.ScrollView {
    protected final LinearLayout verticalLinearLayout;
    final String TAG = "ScrollLayout";

    public ScrollLayout(Context context) {
        super(context);
        Log.d(TAG, "new ScrollLayout");
        verticalLinearLayout = new LinearLayout(context);
        verticalLinearLayout.setOrientation(VERTICAL);
        verticalLinearLayout.setPadding(6, 2, 4, 8);
        this.addView(verticalLinearLayout);
        this.setFillViewport(true);
    }

    public void addText(String text) {
        PixelatedTextView textview = new PixelatedTextView(getContext());
        textview.setText(text);
        textview.setTextColor(Color.WHITE);
        textview.setLayoutParams(new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT));
        textview.setPadding(0, 4, 0, 5);
        verticalLinearLayout.addView(textview);
    }

    public void addRoundButton(String content, String text, final View.OnClickListener action) {
        LinearLayout row = new LinearLayout(getContext());
        RoundButton button = new RoundButton(getContext(), content);
        button.setOnClickListener(action);
        row.addView(button);
        PixelatedTextView textView = new PixelatedTextView(getContext(), text, Font.large());
        row.addView(textView);
        verticalLinearLayout.addView(row);
    }

    public void addLogo() {
        LogoView imageView = new LogoView(getContext(), 2f);
        imageView.setPadding(0, 200, 0, 200);
        imageView.layout(0, 0, 200, 100);
        verticalLinearLayout.addView(imageView);
    }

    public void addButton(String text, final View.OnClickListener action) {
        PixelatedButton button = new PixelatedButton(getContext());
        button.setText(text);
        LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        params.setMargins(0, 12, 0, 12);
        button.setLayoutParams(params);
        verticalLinearLayout.addView(button);
        button.setOnClickListener(action);
    }

    public void onMainActivityPaused() {

    }

    public void onMainActivityResumed() {

    }

}