package com.ganaye.slego.ui;

import android.graphics.Canvas;
import android.graphics.Paint;
import android.graphics.Point;
import android.graphics.PorterDuff;
import android.graphics.PorterDuffColorFilter;
import android.graphics.Rect;
import android.graphics.RectF;

import java.util.HashMap;

public class FontPainter<cache> {
    private static final String TAG = "FontPainter";
    protected static HashMap<Font, FontPainter> cache = new HashMap();
    private static FontPainter largeFontPainter;
    private static FontPainter smallFontPainter;
    public final Font font;
    protected final int fontHeight;
    private final float fontKerning;
    protected float fontLeading;
    protected Rect srcRect;
    protected RectF dstRect;
    Paint paint;

    protected FontPainter(Font font) {
        this.font = font;
        this.fontHeight = font.fontHeight;
        this.fontLeading = font.fontLeading;
        this.fontKerning = font.fontKerning;
        srcRect = new Rect();
        dstRect = new RectF();
        paint = new PixelatedPaint();
    }


    public static FontPainter get(Font originalFont) {
        FontPainter result = cache.get(originalFont);
        if (result == null) {
            result = new FontPainter(originalFont);
            cache.put(originalFont, result);
        }
        return result;
    }

    public void drawText(Canvas canvas, String text, int start, int end,
                         int left, int top, int right, int bottom, int color) {
        float x = left;
        float y = top;
        int width = (right - left);
        if (!font.multiColor) {
            paint.setColorFilter(new PorterDuffColorFilter(color, PorterDuff.Mode.SRC_IN));
        }
        do {
            int widthPx = (int) Math.floor(width);
            int pos = getEndOfLine(text, start, end, widthPx);
            drawSingleLine(canvas, text, start, pos, x, y, paint, 4096);
            start = pos;
            y += fontLeading;
            if (y > bottom) return;
        } while (start < end);
    }

    protected void drawSingleLine(Canvas canvas, String text, int start, int end,
                                  float x, float y, Paint paint, int maxWidth) {
        // Log.d(TAG, "drawSingleLine " + " x:" + x + " y:" + y + " " + text.subSequence(start, end));
        for (int i = start; i < end; i++) {
            x += drawChar(canvas, i, text.charAt(i), x, y, paint) + fontKerning;
            if (x > maxWidth) break;
        }
    }

    protected float drawChar(Canvas canvas, int charIndex, char ch, float x, float y, Paint paint) {
        Font.FontChar fontChar = font.getFontChar(ch);
        if (fontChar == null) return 0;

        int startX = fontChar.startX;
        int charWidth = fontChar.width;
        srcRect.set(startX, 1, startX + charWidth, fontHeight + 1);
        dstRect.set(x, y, x + (charWidth), y + fontHeight);
        canvas.drawBitmap(font.bitmap, srcRect, dstRect, paint);
        return charWidth;
    }

    protected int getEndOfLine(String text, int start, int end, float widthPixel) {
        int x = 0;
        int lastSpacePos = -1;
        for (int i = start; i < end; i++) {
            char ch = text.charAt(i);
            if (ch == ' ') lastSpacePos = i;
            else if (ch == '\n') return i + 1;
            Font.FontChar fontChar = font.getFontChar(ch);
            x += fontChar.width + font.fontKerning;
            if (x > widthPixel) {
                if (lastSpacePos >= 0) return lastSpacePos + 1;
                else if (i > start) return i - 1; // no space we cut a word in the middle
                else return 0;
            }
        }
        return end;
    }

    protected int getWidth(String text, int start, int end) {
        int x = 0;
        for (int i = start; i < end; i++) {
            char ch = text.charAt(i);
            Font.FontChar fontChar = font.getFontChar(ch);
            if (fontChar != null) x += fontChar.width + font.fontKerning;
        }
        return x;
    }

    public Point measureSize(String text, int ostart, int end, int maxWidth) {
        float height = 0;
        int lines = 0;
        int start = ostart;
        do {
            int pos = getEndOfLine(text, start, end, maxWidth);
            lines += 1;
            height += (lines == 1 ? fontHeight : fontLeading);
            start = pos;
        } while (start < end);
        if (lines == 1) {
            return new Point((int) getWidth(text, ostart, end), (int) Math.ceil(height));
        } else {
            return new Point(maxWidth, (int) Math.ceil(height));
        }
    }
}

