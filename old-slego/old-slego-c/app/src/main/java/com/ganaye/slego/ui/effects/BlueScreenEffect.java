package com.ganaye.slego.ui.effects;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Color;

import com.ganaye.slego.ui.BackgroundEffect;


public class BlueScreenEffect extends BackgroundEffect {

    public BlueScreenEffect(Context context) {
        super(context);
    }

    @Override
    protected boolean useBitmap() {
        return false;
    }

    @Override
    public void drawEffect(Canvas bigCanvas) {
        bigCanvas.drawColor(Color.BLUE);
    }


}