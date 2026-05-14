package com.ganaye.slego.ui.effects;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Color;

import com.ganaye.slego.ui.BackgroundEffect;
import com.ganaye.slego.ui.BannerView;
import com.ganaye.slego.ui.Font;

public class BannerEffect extends BackgroundEffect {
    BannerView banner;

    public BannerEffect(Context context) {
        super(context);
        banner = new BannerView(context, false, "Hello World", Font.largeOutlined());
        // addView(banner);
    }

    @Override
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);
        drawEffect(canvas);
    }

    @Override
    public void drawEffect(Canvas canvas) {
        canvas.drawColor(Color.BLACK);
        banner.advance();
        //super.onDraw(canvas);
        banner.drawTo(canvas);
    }

    @Override
    protected void onLayout(boolean changed, int left, int top, int right, int bottom) {
        super.onLayout(changed, left, top, right, bottom);
        if (changed) banner.layout(left, top, right, bottom);
    }


    @Override
    protected boolean useBitmap() {
        return false;
    }

}
