package com.ganaye.slego.ui;

import android.content.Context;
import android.graphics.Canvas;

import com.ganaye.slego.R;

public class RoundButton extends PixelatedButton {
    static final String TAG = "RoundButton";

    public RoundButton(Context context, String content) {
        super(context, content);
        this.upDrawableId = R.drawable.round_button_up;
        this.focusedDrawableId = R.drawable.round_button_up_focused;
        this.downDrawableId = R.drawable.roundbutton_down;
        setPadding(5, 3, 0, 0);
        super.setTextColor(0xFFCCCCCC);
    }

    @Override
    public void onDraw(Canvas canvas) {
        super.onDraw(canvas);
    }

    @Override
    protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
        int size = 20;
        setMeasuredDimension(size, size);
    }
}

