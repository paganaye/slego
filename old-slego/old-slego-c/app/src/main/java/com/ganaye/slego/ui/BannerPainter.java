//package com.ganaye.slego.ui;
//
//import android.graphics.Canvas;
//import android.graphics.Paint;
//import android.os.SystemClock;
//
//public class BannerPainter extends FontPainter {
//    private static BannerPainter instance;
//    private final Paint[] paints;
//    int[] colors = {
//            0xC4C400,
//            0xFF6500,
//            0xC40000,
//            0xC40062,
//            0x6200C4
//    };
//
//    protected BannerPainter() {
//        super(Font.large());
//        paints = new Paint[colors.length];
//        for (int i = 0; i < colors.length; i++) {
//            Paint newPaint = new PixelatedPaint();
//            // newPaint.setColorFilter(new PorterDuffColorFilter(0xFF000000 | colors[i], PorterDuff.Mode.SRC_IN));
//            paints[i] = newPaint;
//        }
//    }
//
//    public static BannerPainter getInstance() {
//        if (instance == null) instance = new BannerPainter();
//        return instance;
//    }
//
//    @Override
//    protected float drawChar(Canvas canvas, int charIndex, char ch, float x, float y, Paint paint) {
//        int charNo = font.chars.indexOf(ch);
//        if (charNo < 0) charNo = 1; // !
//        Font.FontChar fontChar = font.fontChars[charNo];
//        int charWidth = fontChar.width;
//        int startX = fontChar.startX;
//        srcRect.set(startX, 1, startX + charWidth, fontHeight + 1);
//        Double ang = SystemClock.uptimeMillis() / 100.0 + ch;
//        //float fm = 5f + (float) (Math.sin(ang) * 2.5f); //fontHeight / 2f;
//        //float fh = fontHeight; // (float) (fontHeight * (0.75f + (Math.sin(ang) / 4)));
//        float fm = 0;
//        float fh = fontHeight;
//        dstRect.set(x, y + fm, x + charWidth, y + fm + fh);
//        canvas.drawBitmap(font.bitmap, srcRect, dstRect, paints[0]); // charNo % paints.length]);
//        return charWidth;
//    }
//}
