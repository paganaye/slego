package com.ganaye.slego.ui.game;

import android.animation.Animator;
import android.util.Log;

public class XAnimatorListenerAdapter implements Animator.AnimatorListener {
    private static final String tag = "XAnimatorListener";
    private final String subTag;

    public XAnimatorListenerAdapter(String subTag) {
        this.subTag = "[" + subTag + "] ";
        Log.d(tag, subTag + "Constructor");
    }

    @Override
    public void onAnimationStart(Animator animation) {
        Log.d(tag, subTag + "Starts");
    }

    @Override
    public void onAnimationEnd(Animator animation) {
        Log.d(tag, subTag + "Ends");
    }

    @Override
    public void onAnimationCancel(Animator animation) {
        Log.d(tag, subTag + "Canceled");
    }

    @Override
    public void onAnimationRepeat(Animator animation) {
        Log.d(tag, subTag + "Repeat");
    }
}

