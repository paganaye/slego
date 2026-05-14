package com.ganaye.slego.ui.effects;

import android.content.Context;
import android.os.SystemClock;

import com.ganaye.slego.ui.BackgroundEffect;

public class PlasmaEffect extends BackgroundEffect {
    final String TAG = "PlasmaEffect";
    final int ARRAY_RANGE = 2048;
    final int MAX_VALUE = ARRAY_RANGE - 1;
    final int HALF_MAX_VALUE = MAX_VALUE / 2;
    final int ARRAY_MASK = MAX_VALUE;
    final int TWO_MAX_VALUE = 2 * MAX_VALUE;
    final int SQUARED_MAX = MAX_VALUE * MAX_VALUE;
    final int TWO_SQUARED_MAX = 2 * SQUARED_MAX;
    int redPixel = 0;
    int[] sin = new int[ARRAY_RANGE];
    int[] cos = new int[ARRAY_RANGE];
    int[] smallSin = new int[ARRAY_RANGE];
    int[] square = new int[ARRAY_RANGE];
    int[] sqrt = new int[ARRAY_RANGE];
    int PIXEL_SIZE = 4;
    int PLASMA_ZOOM_PERCENT = 100;
    double TWO_PI = 2.0 * Math.PI;
    double BYTE_TO_RAD = TWO_PI / ARRAY_RANGE;
    double RAD_TO_BYTE = ARRAY_RANGE / TWO_PI;
    double HALF_RANGE = MAX_VALUE / 2.0;
    double QUARTER_RANGE = MAX_VALUE / 4.0;
    int frameNo = 0;

    public PlasmaEffect(Context context) {
        super(context);

        for (int i = 0; i < ARRAY_RANGE; i++) {
            double irad = i * BYTE_TO_RAD;
            double sini = Math.sin(irad);
            sin[i] = (int) Math.round(sini * HALF_RANGE + HALF_RANGE);
            double cosi = Math.cos(irad);
            cos[i] = (int) Math.round(cosi * HALF_RANGE + HALF_RANGE);
            smallSin[i] = (int) Math.round(sini * QUARTER_RANGE + QUARTER_RANGE);
            double idbl = i;
            square[i] = (int) Math.round(MAX_VALUE * (idbl * idbl) / MAX_VALUE / MAX_VALUE);
            sqrt[i] = (int) Math.round(MAX_VALUE * Math.sqrt(idbl) / Math.sqrt(MAX_VALUE));
        }
    }

    @Override
    protected void onLayout(boolean changed, int left, int top, int right, int bottom) {
        super.onLayout(changed, left, top, right, bottom);
    }

    @Override
    protected boolean useBitmap() {
        return true;
    }

    public void onDrawBytes(int w, int h, byte[] bitmapData) {
        frameNo++;
        double fsec = SystemClock.elapsedRealtime() / 1000.0;
        double fsecRanged = fsec;
        int sec1 = (int) (Math.round(fsecRanged * RAD_TO_BYTE) & ARRAY_MASK);
        int sec2 = (int) (Math.round((fsecRanged / 2.0) * RAD_TO_BYTE) & ARRAY_MASK);
        int sec3 = (int) (Math.round((fsecRanged / 3.0) * RAD_TO_BYTE) & ARRAY_MASK);
        int sec5 = (int) (Math.round((fsecRanged / 5.0) * RAD_TO_BYTE) & ARRAY_MASK);
        int sec15 = (int) (Math.round((fsecRanged / 15.0) * RAD_TO_BYTE) & ARRAY_MASK);
        int sec25 = (int) (Math.round((fsecRanged / 25.0) * RAD_TO_BYTE) & ARRAY_MASK);
        int sec35 = (int) (Math.round((fsecRanged / 35.0) * RAD_TO_BYTE) & ARRAY_MASK);
        int o = 0;
        int x1, y1;
        int ZOOM = Math.min(PLASMA_ZOOM_PERCENT * ARRAY_RANGE / w,
                PLASMA_ZOOM_PERCENT * ARRAY_RANGE / h);

        for (int y = 0; y < h; y++) {
            y1 = y * ZOOM / 100;
            for (int x = 0; x < w; x++) {
                x1 = x * ZOOM / 100;

                int dx = (x1 + sin[sec5]) & ARRAY_MASK;
                int dy = (y1 + sin[sec3]) & ARRAY_MASK;
                int dz = sin[((x1 * sin[sec2] + y1 * cos[sec3]) + sec1) / MAX_VALUE & ARRAY_MASK];
                int dv =
                        sin[sec15] * sin[(x1 + sec1) & ARRAY_MASK] / MAX_VALUE
                                + sin[sec25] * sin[((x1 * sin[sec2] + y1 * cos[sec3]) + sec1) / MAX_VALUE & ARRAY_MASK] / MAX_VALUE
                                + sin[sec35] * sin[(sin[dx] + cos[dy]) & ARRAY_MASK] / MAX_VALUE;

//                int dv = sqrt[sin[((square[dx] + square[dy]) * 5) & ARRAY_MASK]];
                int r = 60;
                int g = sin[dv & ARRAY_MASK]; // 255 * sin[(dv + ONE_THIRD) & ARRAY_MASK];
                int b = cos[dv & ARRAY_MASK]; // cos[dv & ARRAY_MASK]; //255 * sin[(dv + TWO_THIRD) & ARRAY_MASK];

                bitmapData[o] = (byte) r;
                bitmapData[o + 1] = (byte) ((g * 160 / MAX_VALUE) & 0xC8);
                bitmapData[o + 2] = (byte) ((b * 150 / MAX_VALUE) & 0xC0);
                bitmapData[o + 3] = (byte) 255; // Alpha channel
                o += 4;
            }
        }
//        redPixel += 4;
//        bitmapData[(redPixel * 4) % bitmapData.length] = (byte) 255;
    }
}
