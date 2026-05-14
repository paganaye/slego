package com.ganaye.slego.ui;

import android.annotation.SuppressLint;
import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Point;

import com.ganaye.core.PixelatedView;

public class PixelatedTextView extends PixelatedView {
    private final static String TAG = "PixelatedTextView";
    private final Paint paint;
    protected FontPainter fontPainter;
    private String text;
    private int textColor;

    public PixelatedTextView(Context context) {
        this(context, "", Font.smallOutlined());
    }

    public PixelatedTextView(Context context, String text, Font font) {
        super(context);
        fontPainter = FontPainter.get(font);
        //fontPainter = FontPainter.large();
        paint = new PixelatedPaint();
        setText(text);
        setTextColor(Color.BLACK);
    }

    @Override
    protected void onLayout(boolean changed, int left, int top, int right, int bottom) {
        super.onLayout(changed, left, top, right, bottom);
    }

    @Override
    protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
        int widthPx = MeasureSpec.getSize(widthMeasureSpec)
                - getPaddingLeft() - getPaddingRight();
        Point pt = this.fontPainter.measureSize(
                this.text, 0, this.text.length(),
                widthPx);
        widthPx = (int) pt.x
                + getPaddingLeft() + getPaddingRight();
        int heightPx = (int) Math.ceil(pt.y)
                + getPaddingTop() + getPaddingBottom();
        setMeasuredDimension(widthPx, heightPx);
    }

    @Override
    @SuppressLint("DrawAllocation")
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);
        if (text != null) {
            fontPainter.drawText(canvas, text, 0, text.length(),
                    getPaddingLeft(),
                    getPaddingTop(),
                    getWidth() - getPaddingRight(),
                    getHeight() - getPaddingBottom(),
                    this.textColor);
        }
    }

    public void setTextColor(int newColor) {
        this.textColor = newColor;
        invalidate();
    }


    public void setText(String text) {
        this.text = text;
        invalidate();
    }

    public String getText() {
        return text;
    }

}

