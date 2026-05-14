package com.ganaye.slego.ui.game;

import android.view.animation.Interpolator;

public class SplashInterpolator implements Interpolator {
    public int rebounds = 3;
    private float inputMultiplier;

    public SplashInterpolator() {
        inputMultiplier = (float) (Math.PI * rebounds);
    }

    @Override
    public float getInterpolation(float input) {
        return (float) Math.abs(Math.sin(input * inputMultiplier)) * (1 - input);
    }
}
