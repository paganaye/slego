package com.ganaye.slego.ui;

import android.annotation.SuppressLint;
import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Matrix;
import android.graphics.drawable.BitmapDrawable;

import com.ganaye.core.PixelatedView;

import static com.ganaye.slego.ui.PixelatedPaint.instance;

@SuppressLint("ViewConstructor")
public class PixelatedImageView extends PixelatedView {
    protected Bitmap smallBmp;
    protected Matrix scaleMatrix = new Matrix();
    private int bitmapResourceId;

    public PixelatedImageView(Context context) {
        super(context);
    }

    public PixelatedImageView(Context context, int imageResourceId) {
        this(context);
        setBitmapResourceId(imageResourceId);
    }

    @Override
    protected void onLayout(boolean changed, int left, int top, int right, int bottom) {
        super.onLayout(changed, left, top, right, bottom);
    }

    @Override
    protected void onSizeChanged(int w, int h, int oldw, int oldh) {
        super.onSizeChanged(w, h, oldw, oldh);
        if (smallBmp != null) {
            float scale = ((float) w / smallBmp.getWidth());
            scaleMatrix.setScale(scale, scale);
        }
    }

    @Override
    protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
        super.onMeasure(widthMeasureSpec, heightMeasureSpec);
        // we totally ignore Android measuring flags. The zoom is fixed for us.
        setMeasuredDimension(
                getSuggestedMinimumWidth() + getPaddingLeft() + getPaddingRight(),
                getSuggestedMinimumHeight() + getPaddingTop() + getPaddingBottom());
    }

    @Override
    protected int getSuggestedMinimumWidth() {
        if (smallBmp == null) return 100;
        return (int) Math.ceil(smallBmp.getWidth());
    }

    @Override
    protected int getSuggestedMinimumHeight() {
        if (smallBmp == null) return 100;
        return (int) Math.ceil(smallBmp.getHeight());
    }

    @Override
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);
        if (smallBmp != null) {
            canvas.drawBitmap(smallBmp, scaleMatrix, instance);
        }
    }

    public int getBitmapResourceId() {
        return bitmapResourceId;
    }

    public void setBitmapResourceId(int bitmapResourceId) {
        if (bitmapResourceId == this.bitmapResourceId) return;
        Bitmap newBmp;
        if (bitmapResourceId != 0) {
            BitmapDrawable bitmapDrawable = (BitmapDrawable) getResources().getDrawable(bitmapResourceId);
            newBmp = bitmapDrawable.getBitmap();
        } else newBmp = null;
        this.bitmapResourceId = bitmapResourceId;
        if (newBmp != this.smallBmp) {
            this.smallBmp = newBmp;
            invalidate();
        }
    }
}
