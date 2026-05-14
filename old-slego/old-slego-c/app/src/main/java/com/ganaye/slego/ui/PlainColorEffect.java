package com.ganaye.slego.ui;

import android.content.Context;
import android.graphics.Canvas;

public class PlainColorEffect extends BackgroundEffect {

    private final PixelatedPaint plainPaint;

    public PlainColorEffect(Context context, int color) {
        super(context);
        plainPaint = new PixelatedPaint();
        plainPaint.setColor(color);
    }

    @Override
    protected boolean useBitmap() {
        return false;
    }

    @Override
    public void drawEffect(Canvas canvas) {
        canvas.drawRect(0, 0, getWidth(), getHeight(), plainPaint);
    }
}
