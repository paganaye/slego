package com.ganaye.slego.ui;

import android.annotation.SuppressLint;
import android.content.Context;

@SuppressLint("ViewConstructor")
public class FitPixelatedImageView extends PixelatedImageView {

    public FitPixelatedImageView(Context context, int imageResourceId) {
        super(context, imageResourceId);
    }

    @Override
    protected void onLayout(boolean changed, int left, int top, int right, int bottom) {
        super.onLayout(changed, left, top, right, bottom);
        if (changed) {
            int w = right - left;
            int h = bottom - top;
            scaleMatrix.setScale(
                    ((float) w) / smallBmp.getWidth(),
                    ((float) h) / smallBmp.getHeight());

        }
    }


}
