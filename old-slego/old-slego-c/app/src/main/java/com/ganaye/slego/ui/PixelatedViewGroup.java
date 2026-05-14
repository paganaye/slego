package com.ganaye.slego.ui;

import android.content.Context;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Point;
import android.view.ViewGroup;

import com.ganaye.core.IDisposable;
import com.ganaye.core.PixelatedView;

public abstract class PixelatedViewGroup extends ViewGroup implements IDisposable {

    private final Paint paint;
    private boolean isDisposed;

    public PixelatedViewGroup(Context context) {
        this(context, Color.TRANSPARENT);
    }

    public PixelatedViewGroup(Context context, int backgroundColor) {
        super(context);
        paint = new PixelatedPaint();
        if (backgroundColor != Color.TRANSPARENT) {
            setWillNotDraw(false);
            paint.setColor(backgroundColor);
        }
    }

    @Override
    public void dispose() {
        if (isDisposed) return;
        isDisposed = true;
        PixelatedView.disposeChildren(this);
    }

    @Override
    public boolean isDisposed() {
        return isDisposed;
    }

    public Point getCenter() {
        return new Point((getLeft() + getRight()) / 2, (getTop() + getBottom()) / 2);
    }

}
