package com.ganaye.slego.ui;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Paint;
import android.os.Handler;
import android.os.SystemClock;

import com.ganaye.core.PixelatedView;

public class BannerView extends PixelatedView {
    private static final int BANNER_FPS = 60;
    private final Paint paint;
    private final Handler handler;
    private final FontPainter fontPainter;
    private final float SCROLL_SPEED = 0.15f; // PIXEL / SEC
    public String text;
    int charStart = 0;
    float scrollX = 0;
    private long bannerStart;
    private final Runnable handlerTick = new Runnable() {
        @Override
        public void run() {
            advance();
            handler.postDelayed(handlerTick, 1000 / BANNER_FPS);
            //        private static final int MARQUEE_RESOLUTION = 1000 / 30;
            invalidate();
        }
    };

    public BannerView(Context context, Boolean startHandler, String text, Font font) {
        super(context);
        paint = new PixelatedPaint();
        paint.setColor(0xFF002200);
        this.text = text; //

        fontPainter = new FontPainter(font) {
            @Override
            protected void drawSingleLine(Canvas canvas, String text, int start, int end, float x, float y, Paint paint, int maxWidth) {
                super.drawSingleLine(canvas, text, start, end, x, y, paint, maxWidth);
            }

            @Override
            protected float drawChar(Canvas canvas, int charIndex, char ch, float x, float y, Paint paint) {
                //y = (float) (sy0 + Math.sin(charIndex * syf) * sy1);
                return super.drawChar(canvas, charIndex, ch, x, y, paint);
            }
        };
        bannerStart = SystemClock.uptimeMillis();
        handler = new Handler();
        if (startHandler) {
            bannerStart = SystemClock.uptimeMillis();
            handlerTick.run();
        }
    }


    public void advance() {
        long now = SystemClock.uptimeMillis();
        long ellapsedMs = (now - bannerStart);
        bannerStart = now;
        scrollX += ellapsedMs * SCROLL_SPEED;
        Font font = fontPainter.font;
        if (charStart >= text.length()) {
            charStart = 0;
            scrollX = -1f * getWidth();
        } else {
            while (charStart < text.length() && scrollX > font.charWidthMax) {
                char ch = text.charAt(charStart);
                Font.FontChar fontChar = font.getFontChar(ch);
                charStart += 1;
                if (fontChar != null) {
                    scrollX -= fontChar.width;
                }
            }
        }
    }

    public void drawTo(Canvas canvas) {
        if (charStart >= text.length()) return;
        int width = this.getWidth();

        fontPainter.drawSingleLine(
                canvas,
                text,
                charStart, text.length(),
                -scrollX, 0, paint, width);

    }

    @Override
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);
        drawTo(canvas);
    }
}
