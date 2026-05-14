package com.ganaye.slego.ui;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.Color;
import android.graphics.drawable.BitmapDrawable;

import com.ganaye.slego.R;
import com.ganaye.slego.SlegoApp;

public class Font {
    private static final String TAG = "Font";
    private static Font smallFont, largeFont;
    private static Font largeOutlinedFont;
    private static Font smallOutlined;
    private static Font smallOutlinedReducedLeading;
    public final int fontHeight;
    public final boolean multiColor;
    final Bitmap bitmap;
    String chars = " !\"#$%&'()*,-+./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_£abcdefghijklmnopqrstuvwxyz{|}~©ÇüéâäàçêëèïîÄÉôöûÖÜβá€⋮";
    FontChar[] fontChars;
    public float fontLeading;
    float fontKerning;
    int charWidthMax;

    private Font(Context context, int resId, boolean multiColor) {
        this(((BitmapDrawable) context.getResources().getDrawable(resId)).getBitmap(), multiColor);
    }

    private Font(Bitmap bitmap, boolean multiColor) {
        this.bitmap = bitmap;
        fontHeight = bitmap.getHeight() - 1;
        fontLeading = fontHeight + 2;
        fontKerning = 0;
        fontChars = new FontChar[chars.length()];
        int w = bitmap.getWidth();
        int charCount = chars.length();
        int x = 0;
        for (int charNo = 0; charNo < charCount; charNo++) {
            int startX = x;
            while (x < w && !isLastPixelOfChar(x)) x += 1;
            int width = x - startX + 1;
            fontChars[charNo] = new FontChar(chars.charAt(charNo), startX, width);
            if (charNo == 0 || width > charWidthMax) charWidthMax = width;
            // Log.d(TAG, "char " + charNo + " " + chars.charAt(charNo) + " start " + fontChars[charNo].startX + " width " + fontChars[charNo].width);
            x += 1;
        }
        this.multiColor = multiColor;
    }

    public static Font large() {
        if (largeFont == null) {
            largeFont = new Font(SlegoApp.getInstance(), R.drawable.font_large, false);
        }
        return largeFont;
    }

    public static Font smallOutlined() {
        if (smallOutlined == null) {
            smallOutlined = OutlinedFont.makeOutlinedFont(small());
        }
        return smallOutlined;
    }

    public static Font largeOutlined() {
        if (largeOutlinedFont == null) {
            largeOutlinedFont = OutlinedFont.makeOutlinedFont(large());
        }
        return largeOutlinedFont;
    }

    public static Font small() {
        if (smallFont == null)
            smallFont = new Font(SlegoApp.getInstance(), R.drawable.font_small, false);
        return smallFont;
    }

    public static Font fromBitmap(Bitmap bitmap, boolean multiColor) {
        return new Font(bitmap, multiColor);
    }

    boolean isLastPixelOfChar(int x) {
        int alpha = Color.alpha(bitmap.getPixel(x, 0));
        return (alpha == 255);
    }

    public FontChar getFontChar(char ch) {
        int charNo = chars.indexOf(ch);
        // generally the first is a space and this one an exclamation mark
        if (charNo < 0) return null;
        return fontChars[charNo];
    }

    class FontChar {
        public final char ch;
        public final int startX;
        public final int width;

        FontChar(char ch, int startX, int width) {
            this.ch = ch;
            this.startX = startX;
            this.width = width;
        }
    }

}
