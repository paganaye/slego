package com.ganaye.slego.ui;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Rect;
import android.graphics.RectF;
import android.graphics.drawable.BitmapDrawable;

import com.ganaye.slego.SlegoApp;

import java.util.HashMap;

public class PixelatedNinePatch {
    static HashMap<Integer, PixelatedNinePatch> mapById = new HashMap<>();
    private final Bitmap bitmap;
    int[] sx = new int[4];
    int[] sy = new int[4];
    float[] dx = new float[4];
    float[] dy = new float[4];
    Rect srcRect = new Rect();
    RectF dstRect = new RectF();

    public PixelatedNinePatch(Context context, int imageResourceId) {
        this.bitmap = ((BitmapDrawable) context.getResources().getDrawable(imageResourceId)).getBitmap();
        calcBoundaries("x", bitmap.getWidth(), (n) -> bitmap.getPixel(n, 0), sx);
        calcBoundaries("y", bitmap.getHeight(), (n) -> bitmap.getPixel(0, n), sy);
    }

    public static PixelatedNinePatch getById(int imageResourceId) {
        PixelatedNinePatch result = mapById.get(imageResourceId);
        if (result == null) {
            result = new PixelatedNinePatch(SlegoApp.getInstance(), imageResourceId);
            mapById.put(imageResourceId, result);
        }
        return result;
    }

    private void calcBoundaries(String axis, int width, GetPixel getPixel, int[] sx) {
        sx[0] = 1;
        sx[1] = -1;
        sx[2] = -1;
        sx[3] = width - 1;
        for (int x = 1; x < width - 1; x++) {
            boolean plain = Color.alpha(getPixel.getPixel(x)) > 0;
            if (sx[1] < 0) {
                if (plain) sx[1] = x;
            } else if (sx[2] < 0 && !plain) {
                sx[2] = x;
                break;
            }
        }
    }

    public void draw(Canvas canvas, int left, int top, int right, int bottom) {
        calcFloats(sx, left, right, dx);
        calcFloats(sy, top, bottom, dy);
        for (int y = 0; y < 3; y++) {
            for (int x = 0; x < 3; x++) {
                srcRect.set(sx[x], sy[y], sx[x + 1], sy[y + 1]);
                dstRect.set(dx[x], dy[y], dx[x + 1], dy[y + 1]);
                canvas.drawBitmap(this.bitmap, srcRect, dstRect, PixelatedPaint.instance);
            }
        }
    }

    private void calcFloats(int[] sx, int left, int right, float[] dx) {
        dx[0] = left;
        dx[1] = dx[0] + (sx[1] - sx[0]);
        dx[2] = right - (sx[3] - sx[2]);
        dx[3] = right;
    }

    interface GetPixel {
        int getPixel(int n);
    }
}
