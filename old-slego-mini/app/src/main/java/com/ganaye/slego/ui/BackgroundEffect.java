package com.ganaye.slego.ui;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Paint;
import android.graphics.PixelFormat;
import android.graphics.Rect;
import android.graphics.RectF;
import android.util.Log;
import android.view.SurfaceHolder;
import android.view.SurfaceView;

import com.ganaye.core.IDisposable;
import com.ganaye.slego.SlegoApp;

import java.nio.ByteBuffer;


public abstract class BackgroundEffect extends SurfaceView implements IDisposable {
    //    private final static String TAG = "GameLayer";
    private static final String TAG = "Effect";
    static int threadCounter;
    protected final Rect srcRect;
    protected final RectF dstRect;
    private final SurfaceHolder surfaceHolder;
    protected byte[] bitmapData;
    protected Bitmap bitmap;
    protected Paint effectPaint;
    private boolean isSurfaceCreated;
    private Thread activeThread;
    private boolean disposed;

    public BackgroundEffect(Context context) {
        super(context);
        srcRect = new Rect();
        dstRect = new RectF();
        effectPaint = PixelatedPaint.instance;

        surfaceHolder = this.getHolder();
        surfaceHolder.setFormat(PixelFormat.RGBA_8888);
        surfaceHolder.addCallback(new SurfaceHolder.Callback2() {
            @Override
            public void surfaceRedrawNeeded(SurfaceHolder holder) {

            }

            @Override
            public void surfaceCreated(SurfaceHolder holder) {
                Log.d(TAG, "ThreadedSurfaceView.surfaceCreated()");
                isSurfaceCreated = true;
                startThread();
            }

            @Override
            public void surfaceChanged(SurfaceHolder holder, int format, int width, int height) {
                Log.d(TAG, "ThreadedSurfaceView.surfaceChanged()");
            }

            @Override
            public void surfaceDestroyed(SurfaceHolder holder) {
                Log.d(TAG, "ThreadedSurfaceView.surfaceDestroyed()");
                // Set thread running flag to false when Surface is destroyed.
                // Then the thread will jump out the while loop and complete.
                isSurfaceCreated = false;
            }
        });
        // Set the SurfaceView object at the top of View object.
        // setZOrderOnTop(true);
    }

    public void startThread() {
        Thread newThread = new Thread(() -> {
            threadCounter += 1;
            String threadName = getClass().getSimpleName() + "BackgroundThread#" + threadCounter;
            Thread.currentThread().setName(threadName);
            Log.w(TAG, "Starting thread");
            // = Thread.currentThread().getId();
            try {
                backgroundTreadRenderLoop();
                Log.w(TAG, threadName + " dying gracefully.");
            } catch (Exception e) {
                Log.e(TAG, threadName, e);
            }
        });
        this.activeThread = newThread;
        newThread.start();
    }

    private void backgroundTreadRenderLoop() throws InterruptedException {
        int fps = 30;
        int frameDuration = 1000 / fps;
        long startTime = System.currentTimeMillis();
        int fpsFrameCount = 0;
        long fpsFrameStart = startTime;
        SlegoApp app = SlegoApp.getInstance();
        Thread currentThread = Thread.currentThread();

        // this threads has a cheap fuse.
        while (isSurfaceCreated
                && this.activeThread == currentThread
                && !isDisposed()
                && !app.isActivityPaused()) {
            Canvas canvas = surfaceHolder.lockCanvas();
            try {
                if (canvas == null) continue;
                else drawEffect(canvas);
            } finally {
                if (canvas != null) surfaceHolder.unlockCanvasAndPost(canvas);
            }

            long endTime = System.currentTimeMillis();
            long frameTime = endTime - startTime;
            if (frameTime < frameDuration) Thread.sleep(frameDuration - frameTime);
            startTime = endTime;
            fpsFrameCount += 1;
            if (endTime - fpsFrameStart > 5000) {
                Log.d(TAG, "fps:" + 1000 * fpsFrameCount / (endTime - fpsFrameStart));
                fpsFrameStart = endTime;
                fpsFrameCount = 0;
            }
        }
        Log.d(TAG, "Stopped gracefully. disposed:" + isDisposed());
    }

    @Override
    public boolean isDisposed() {
        return disposed;
    }

    @Override
    protected void onSizeChanged(int w, int h, int oldW, int oldH) {
        super.onSizeChanged(w, h, oldW, oldH);
        if (useBitmap()) {
            if (bitmap == null || bitmap.getWidth() != w || bitmap.getHeight() != h) {
                Bitmap newBitmap = Bitmap.createBitmap(w, h, Bitmap.Config.ARGB_8888);
                bitmapData = new byte[w * h * 4];
                srcRect.set(0, 0, w, h);
                dstRect.set(0, 0, w, h);
                bitmap = newBitmap;
            }
        }
    }

    protected abstract boolean useBitmap();

    protected void onDrawBytes(int w, int h, byte[] bitmapData) {
    }

    @Override
    protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
        super.onMeasure(widthMeasureSpec, heightMeasureSpec);
    }

    public void drawEffect(Canvas canvas) {
        if (bitmap == null || canvas == null || isDisposed()) return;
        int w = bitmap.getWidth();
        int h = bitmap.getHeight();
        onDrawBytes(w, h, bitmapData);
        ByteBuffer retBuf = ByteBuffer.wrap(bitmapData);
        bitmap.copyPixelsFromBuffer(retBuf);
        canvas.drawBitmap(bitmap, srcRect, dstRect, effectPaint);
    }

    @Override
    public void dispose() {
        Log.d(TAG, "Effect.dispose()");
        if (!disposed) {
            disposed = true;
        }
    }

    @Override
    protected void onDetachedFromWindow() {
        Log.d(TAG, "Effect.onDetachedFromWindow()");
        super.onDetachedFromWindow();
    }

    @Override
    protected void onAttachedToWindow() {
        Log.d(TAG, "Effect.onAttachedToWindow()");
        super.onAttachedToWindow();
    }
}