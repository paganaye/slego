package com.ganaye.slego.ui.effects;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Rect;
import android.graphics.RectF;
import android.graphics.drawable.BitmapDrawable;

import com.ganaye.slego.R;
import com.ganaye.slego.SlegoApp;
import com.ganaye.slego.ui.BackgroundEffect;
import com.ganaye.slego.ui.PixelatedPaint;

import java.util.ArrayList;
import java.util.Random;

public class StarFieldEffect extends BackgroundEffect {
    static final String TAG = "StarField";
    static final int PLANET_COUNT = 2;
    static final float PLANET_DISTANCE = 1.5f;
    static final float PLANET_ZOOM = 0.15f;
    static final int STAR_COUNT = 250;
    static final float STAR_DISTANCE = 1f;
    static final float STAR_SIZE = 0.5f;
    static final int GALAXY_COUNT = 1;
    static final float GALAXY_DISTANCE = 20;
    static final float GALAXY_ZOOM = 2.5f;
    static float ADVANCE_SPEED = 0.01f;
    static float PLANET_ALPHA_ADVANCE = 0.0125f;
    static float GALAXY_ALPHA_ADVANCE = .005f;

    static Random rnd = new Random();
    static int[] starColors = {
            0x7f7f7f,  // white
            0x7f7f7f,  // white
            0x7f7f7f,  // white
            0x7f7f7f,  // white
            0x7f7f7f,  // white
            0x7f7f7f,  // white
            0x7f7f7f,  // white
            0x7f7f7f,  // white
            0x7f7f7f,  // white
            0x7f7f7f,  // white
            0x3f3f3f,  // gray
            0x030001,  // sand
            0x7f7f01,  // yellow
            0x38736C,  // light blue
            0x06294A,  // grayish blue
            0x7f7f01,  // orange
            0x7e0000,  // red
            0x000076,  // navy blue
    };
    static int[] galaxyIds = {
            R.drawable.g1_heic0206b,
            R.drawable.g2_heic0506a,
            R.drawable.g3_heic0810ae,
            R.drawable.g4_heic0810am,
            R.drawable.g5_heic0810as,
            R.drawable.g6_heic0814a,
            R.drawable.g7_heic0910i,
            R.drawable.g8_heic1107a,
            R.drawable.g9_heic1425e,
            R.drawable.g10_heic1716a,
            R.drawable.g11_heic1919a,
            R.drawable.g12_heic2002a,
            R.drawable.g14_opo9941a,
            R.drawable.g15_potw1213a,
            R.drawable.g16_potw1326a,
            R.drawable.g17_potw1345a,
            R.drawable.g18_potw1411a,
            R.drawable.g19_potw1422a,
            R.drawable.g20_potw1517a,
            R.drawable.g21_potw1628a,
            R.drawable.g22_potw1629a,
            R.drawable.g23_potw1709a,
            R.drawable.g24_potw2015a,
            R.drawable.g25_potw2026a
    };
    static Bitmap[] galaxyBitmaps = new Bitmap[galaxyIds.length];
    static int[] planetIds = {
            R.drawable.sun, // I know I know
            R.drawable.planet_1,
            R.drawable.planet_2,
            R.drawable.planet_3,
            R.drawable.planet_4,
            R.drawable.planet_5,
            R.drawable.planet_6,
            R.drawable.planet_7,
            R.drawable.planet_8,
            R.drawable.planet_9
    };
    static Bitmap[] planetBitmaps = new Bitmap[planetIds.length];
    static RectF galaxyDstRect = new RectF(0, 0, 32, 32);
    static RectF planetDstRect = new RectF();


    static {
        for (int i = 0; i < galaxyIds.length; i++) {
            galaxyBitmaps[i] = ((BitmapDrawable) SlegoApp.getInstance().getResources()
                    .getDrawable(galaxyIds[i])).getBitmap();
        }
        for (int i = 0; i < planetIds.length; i++) {
            planetBitmaps[i] = ((BitmapDrawable) SlegoApp.getInstance().getResources()
                    .getDrawable(planetIds[i])).getBitmap();
        }
    }

    ArrayList<GalacticThing> galacticThings = new ArrayList<>();
    int screenWidth, screenHeight, screenCenterX, screenCenterY;
    private Canvas smallCanvas;
    private float starSpreadX, starSpreadY;
    private float planetSpreadX, planetSpreadY;
    private float galaxySpreadX, galaxySpreadY;

    public StarFieldEffect(Context context) {
        super(context);
        for (int n = 0; n < GALAXY_COUNT; n++) galacticThings.add(new Galaxy());
        for (int n = 0; n < STAR_COUNT; n++) galacticThings.add(new Star());
        for (int n = 0; n < PLANET_COUNT; n++) galacticThings.add(new Planet());
    }

    @Override
    protected void onSizeChanged(int width, int height, int oldW, int oldH) {
        super.onSizeChanged(width, height, oldW, oldH);
        smallCanvas = new Canvas(bitmap);
        this.screenWidth = width;
        this.screenHeight = height;
        this.screenCenterX = width / 2;
        this.screenCenterY = height / 2;
        starSpreadX = screenCenterX * STAR_DISTANCE;
        starSpreadY = screenCenterY * STAR_DISTANCE;
        planetSpreadX = screenCenterX * PLANET_DISTANCE;
        planetSpreadY = screenCenterY * PLANET_DISTANCE;
        galaxySpreadX = screenCenterX * GALAXY_DISTANCE;
        galaxySpreadY = screenCenterY * GALAXY_DISTANCE;

    }

    @Override
    protected boolean useBitmap() {
        return true;
    }

    @Override
    public void drawEffect(Canvas bigCanvas) {
        smallCanvas.drawColor(Color.BLACK);
        for (int n = 0; n < galacticThings.size(); n++) galacticThings.get(n).updateAndShow();
        bigCanvas.drawBitmap(bitmap, srcRect, dstRect, PixelatedPaint.instance);
    }

    public abstract class GalacticThing {
        protected float x, y, z;
        float sw, sh;
        float tx, ty;
        float tw, th;

        public abstract void setRandomLocation();

        void updateAndShow() {
            z -= ADVANCE_SPEED;
            transform();
            if (isOutOfScreen()) {
                initialize();
            } else {
                // Log.d(TAG, "painting planet");
                if (z > 0) paint();
            }
        }

        private boolean isOutOfScreen() {
            return (tx + tw < 0 || ty + th < 0 || tx - tw > screenWidth || ty - th > screenHeight || z < 0);
        }

        private void transform() {
            if (z < 0.01f) z = -1f;
            tx = screenCenterX + x / z;
            ty = screenCenterY + y / z;
            tw = sw / z;
            th = sh / z;
        }

        abstract void onInitialize();

        abstract void paint();


        public void initialize() {
            this.setRandomLocation();
            onInitialize();
            transform();
        }
    }

    public class Planet extends GalacticThing {
        private final Rect planetSrcRect = new Rect();
        private Bitmap bitmap;
        private float alpha;
        private Paint planetPaint = new PixelatedPaint();

        @Override
        public void setRandomLocation() {
            x = (rnd.nextFloat() - 0.5f) * planetSpreadX;
            y = (rnd.nextFloat() - 0.5f) * planetSpreadY;
            z = rnd.nextFloat() * PLANET_DISTANCE;
            alpha = 0;
        }

        public void onInitialize() {
            this.bitmap = planetBitmaps[rnd.nextInt(planetBitmaps.length)];
            planetSrcRect.set(0, 0, (int) bitmap.getWidth(), bitmap.getHeight());
            sw = bitmap.getWidth() * PLANET_ZOOM;
            sh = bitmap.getHeight() * PLANET_ZOOM;
        }

        @Override
        void paint() {
            alpha += PLANET_ALPHA_ADVANCE;
            planetPaint.setAlpha(alpha < 1 ? (int) (alpha * 128f) : 128);
            planetDstRect.set(tx - tw, ty - th, tx + tw, ty + th);
            smallCanvas.drawBitmap(bitmap, planetSrcRect, planetDstRect, planetPaint);
        }


    }

    public class Star extends GalacticThing {
        Paint paint = new Paint();
        private float px;
        private float py;
        private int color;

        @Override
        public void setRandomLocation() {
            x = (rnd.nextFloat() - 0.5f) * starSpreadX;
            y = (rnd.nextFloat() - 0.5f) * starSpreadY;
            z = rnd.nextFloat() * STAR_DISTANCE;
        }

        public void onInitialize() {
            color = starColors[rnd.nextInt(starColors.length)] | 0xFF000000;
            super.transform();
            px = tx;
            py = ty;
            sw = STAR_SIZE;
            sh = STAR_SIZE;
        }

        @Override
        void paint() {
            paint.setAlpha(255);
            paint.setStrokeWidth(Math.min(2, tw));
            paint.setColor(color);
            smallCanvas.drawLine(px, py, tx, ty, paint);
            px = tx;
            py = ty;
        }
    }

    public class Galaxy extends GalacticThing {
        private final Rect galaxySrcRect = new Rect();
        float alpha;
        private Bitmap bitmap;
        private Paint galaxyPaint;

        @Override
        public void setRandomLocation() {
            x = (rnd.nextFloat() - 0.5f) * galaxySpreadX;
            y = (rnd.nextFloat() - 0.5f) * galaxySpreadY;
            z = rnd.nextFloat() * GALAXY_DISTANCE;
            galaxyPaint = new PixelatedPaint();
            //galaxyPaint.setFilterBitmap(false);
            //galaxyPaint.setAntiAlias(true);
            alpha = 0;
        }


        public void onInitialize() {
            this.bitmap = galaxyBitmaps[rnd.nextInt(galaxyBitmaps.length)];
            galaxySrcRect.set(0, 0, bitmap.getWidth(), bitmap.getHeight());
            sw = bitmap.getWidth() * GALAXY_ZOOM;
            sh = bitmap.getHeight() * GALAXY_ZOOM;
        }

        @Override
        void paint() {
            alpha += GALAXY_ALPHA_ADVANCE;
            galaxyPaint.setAlpha(alpha < 1 ? (int) (alpha * 140f) : 140);
            galaxyDstRect.set(tx - tw, ty - th, tx + tw, ty + th);
            smallCanvas.drawBitmap(bitmap, galaxySrcRect, galaxyDstRect, galaxyPaint);
        }
    }
}