package com.ganaye.slego.ui;

import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.PorterDuff;
import android.graphics.PorterDuffColorFilter;

public class OutlinedFont {
    public static Font makeOutlinedFont(Font originalFont) {
        int newWidth = 1;
        int newHeight = originalFont.fontHeight + 3;
        String chars = originalFont.chars;
        for (int i = 0; i < chars.length(); i++) {
            char ch = chars.charAt(i);
            Font.FontChar originalFontChar = originalFont.getFontChar(ch);
            int charWidth = originalFontChar.width + 1;
            newWidth += charWidth;
        }
        Bitmap newBitmap = Bitmap.createBitmap(newWidth, newHeight, Bitmap.Config.ARGB_8888);
        FontPainter originalFontPainter = FontPainter.get(originalFont);
        Canvas canvas = new Canvas(newBitmap);
        Paint blackPaint = new PixelatedPaint();
        blackPaint.setColorFilter(new PorterDuffColorFilter(Color.DKGRAY, PorterDuff.Mode.SRC_IN));
        Paint whitePaint = new PixelatedPaint();
        whitePaint.setColorFilter(new PorterDuffColorFilter(Color.WHITE, PorterDuff.Mode.SRC_IN));
        int x = 0;
        for (int i = 0; i < chars.length(); i++) {
            char ch = chars.charAt(i);
            Font.FontChar originalFontChar = originalFont.getFontChar(ch);
            originalFontPainter.drawChar(canvas, i, ch, x + 1f, 1f, blackPaint);
            originalFontPainter.drawChar(canvas, i, ch, x, 2f, blackPaint);
            originalFontPainter.drawChar(canvas, i, ch, x + 2f, 2f, blackPaint);
            originalFontPainter.drawChar(canvas, i, ch, x + 1f, 3f, blackPaint);
            originalFontPainter.drawChar(canvas, i, ch, x + 1, 2f, whitePaint);
            x += originalFontChar.width + 1;
            // setting single character separation pixel.
            canvas.drawRect(x - 1f, 0f, x, 1f, blackPaint);
        }
        Font result = Font.fromBitmap(newBitmap, true);
        result.fontKerning = -1;
        return result;
    }
}
