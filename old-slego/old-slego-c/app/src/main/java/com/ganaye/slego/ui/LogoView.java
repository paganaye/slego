package com.ganaye.slego.ui;

import android.annotation.SuppressLint;
import android.content.Context;
import android.graphics.Canvas;

import com.ganaye.slego.R;

@SuppressLint("ViewConstructor")
public class LogoView extends PixelatedImageView {
    final static String TAG = "LogoView";
    private final float zoom;

    public LogoView(Context context, float zoom) {
        super(context, R.drawable.logo);
        this.zoom = zoom;
    }

    @Override
    protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
        if (zoom != 1) {
            int w = (int) Math.ceil(super.smallBmp.getWidth() * zoom);
            int h = (int) Math.ceil(super.smallBmp.getHeight() * zoom);
            setMeasuredDimension(w, h);
        } else {
            super.onMeasure(widthMeasureSpec, heightMeasureSpec);
        }
    }

    @Override
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);
        invalidate();
    }
}
