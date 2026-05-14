package com.ganaye.core;

import android.content.Context;
import android.graphics.Point;
import android.view.View;
import android.view.ViewGroup;

public class PixelatedView extends View implements IDisposable {
    private boolean isDisposed;

    public PixelatedView(Context context) {
        super(context);
    }

    public static void disposeChildren(ViewGroup viewgroup) {
        for (int i = viewgroup.getChildCount() - 1; i >= 0; i--) {
            View child = viewgroup.getChildAt(i);
            if (child instanceof IDisposable) {
                if (!((IDisposable) child).isDisposed()) ((IDisposable) child).dispose();
            } else if (child instanceof ViewGroup) disposeChildren((ViewGroup) child);
        }
    }

    @Override
    public void dispose() {
        if (isDisposed) return;
        isDisposed = true;
    }

    @Override
    public boolean isDisposed() {
        return isDisposed;
    }

    protected Point getCenter() {
        return new Point((getLeft() + getRight()) / 2, (getTop() + getBottom()) / 2);
    }
}

