package com.ganaye.slego.ui;

import android.annotation.SuppressLint;
import android.content.Context;

import com.ganaye.slego.SlegoApp;

@SuppressLint("ViewConstructor")
public class BackButton extends RoundButton {

    public BackButton(Context context) {
        super(context, "<");
        setOnClickListener((v) -> SlegoApp.getInstance().onBackPressed());
    }

}

