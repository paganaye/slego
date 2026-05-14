package com.ganaye.slego.ui;

import android.content.Context;
import android.graphics.Canvas;
import android.util.Log;
import android.view.MotionEvent;

import com.ganaye.slego.R;

public class PixelatedButton extends PixelatedTextView {
    static final String TAG = "Button";
    public int upDrawableId = R.drawable.button_up;
    public int focusedDrawableId = R.drawable.button_up_focused;
    public int downDrawableId = R.drawable.button_down;

    public PixelatedButton(Context context) {
        super(context);
        super.fontPainter = FontPainter.get(Font.largeOutlined());
        //super.setTextColor(0xFFEEEEEE);
        int padding = 4;
        setPadding(padding, padding, padding, padding);
    }

    public PixelatedButton(Context context, String text) {
        this(context);
        setText(text);
    }

    @Override
    public boolean performClick() {
        invalidate();
        return super.performClick();
    }

    @Override
    public boolean onTouchEvent(MotionEvent event) {
        Log.d(TAG, "onTouchEvent " + event.getAction());
        switch (event.getAction()) {
            case MotionEvent.ACTION_DOWN:
                this.setPressed(true);
                invalidate();
                return true;

            case MotionEvent.ACTION_CANCEL:
                if (this.isPressed()) {
                    this.setPressed(false);
                    invalidate();
                }
                break;
            case MotionEvent.ACTION_MOVE:
                // Log.d(TAG, "ACTION_MOVE " + event.getX() + " " + event.getY());
                boolean isAboveButton = event.getX() >= 0 && event.getY() >= 0
                        && event.getX() < this.getWidth() && event.getY() < this.getHeight();
                if (isPressed() && !isAboveButton) {
                    this.setPressed(false);
                    invalidate();
                }
                return true;
            case MotionEvent.ACTION_UP:
                if (this.isPressed()) {
                    this.setPressed(false);
                    performClick();
                }
                break;
        }
        return super.onTouchEvent(event);
    }


    @Override
    public void onDraw(Canvas canvas) {
        int id = isPressed() ? downDrawableId : (isFocused() ? focusedDrawableId : upDrawableId);
        PixelatedNinePatch.getById(id).draw(canvas, 0, 0, getWidth(), getHeight());
        super.onDraw(canvas);
    }

}

