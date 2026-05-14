package com.ganaye.slego.utils;

import android.animation.ValueAnimator;

public class AnimationUtils {
    public static void fixAnimations() {
        try {
            ValueAnimator.class.getMethod("setDurationScale", float.class).invoke(null, 1f);
        } catch (Throwable t) {
            // we ignore this
        }
    }
}
