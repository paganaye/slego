package com.ganaye.slego.ui;

import android.graphics.DrawFilter;
import android.graphics.Paint;
import android.graphics.PaintFlagsDrawFilter;


//
//import android.annotation.SuppressLint;
//import android.content.Context;
//import android.graphics.Canvas;
//import android.graphics.DrawFilter;
//import android.graphics.Matrix;
//import android.graphics.Paint;
//import android.graphics.PaintFlagsDrawFilter;
//
//import com.ganaye.core.DisposableView;
//import com.ganaye.slego.SlegoApp;
//
//@SuppressLint("ViewConstructor")
public class PixelatedPaint extends Paint {
    public static final Paint instance;
    public static final DrawFilter noAntiAliasFilter;

    static {
        instance = new PixelatedPaint();
        noAntiAliasFilter = new PaintFlagsDrawFilter(Paint.ANTI_ALIAS_FLAG | Paint.FILTER_BITMAP_FLAG | Paint.DITHER_FLAG, 0);
    }

    public PixelatedPaint() {
        setFilterBitmap(false);
        setAntiAlias(false);
    }


}
