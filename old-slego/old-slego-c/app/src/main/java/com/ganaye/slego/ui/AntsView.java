package com.ganaye.slego.ui;

import android.content.Context;
import android.content.res.Resources;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Matrix;
import android.graphics.Point;
import android.graphics.PointF;
import android.graphics.Rect;
import android.graphics.RectF;
import android.graphics.drawable.BitmapDrawable;
import android.os.SystemClock;

import com.ganaye.slego.R;
import com.ganaye.slego.SlegoApp;
import com.ganaye.slego.model.Game;
import com.ganaye.slego.model.Piece;
import com.ganaye.slego.model.RoundResult;

import static com.ganaye.slego.ui.game.GameScreenLayout.TILE_SIZE;

public class AntsView extends PixelatedViewGroup {
    public static final int ANTS_CORNER = 0;
    public static final int ANTS_LEFT = 1;
    public static final int ANTS_INNER_CORNER = 2;
    public static final int ROTATE_0 = 0;
    public static final int ROTATE_90 = 1;
    public static final int ROTATE_180 = 2;
    public static final int ROTATE_270 = 3;
    private static final String TAG = "AntsView";
    private static final int ANTS_TYPE_COUNT = 3;
    private static final int ANTS_ANIM_COUNT = 5;
    private static final int ANT_WIDTH = 30;
    private static final int ANT_HEIGHT = 30;
    private static final Rect srcRect = new Rect(0, 0, ANT_WIDTH, ANT_HEIGHT);

    private static final RectF dstRect = new RectF();
    private static Bitmap someAnts;
    private static Bitmap allAnts;

    static {
        prepareAnts();
    }

    private final Game game;
    private float xc;
    private float yc;
    private float antSize;

    public AntsView(Context context, Game game) {
        super(context);
        this.game = game;
        setWillNotDraw(false);
    }

    private static void prepareAnts() {
        SlegoApp app = SlegoApp.getInstance();
        Resources resources = app.getResources();
        someAnts = ((BitmapDrawable) resources.getDrawable(R.drawable.ants)).getBitmap();
        allAnts = rotateBitmap(someAnts, ANT_WIDTH, ANT_HEIGHT);
    }

    private static Bitmap rotateBitmap(Bitmap srcBitmap, int w, int h) {
        Bitmap dstBitmap = Bitmap.createBitmap(srcBitmap.getWidth() * 4, srcBitmap.getHeight(),
                Bitmap.Config.ARGB_8888);
        Canvas canvas = new Canvas(dstBitmap);
        Rect srcRect = new Rect(0, 0, w, h);
        int animCount = srcBitmap.getHeight() / h;
        int typeCount = srcBitmap.getWidth() / w;
        for (int y = 0; y < animCount; y++) {
            for (int x = 0; x < typeCount; x++) {
                srcRect.offsetTo(x * w, y * h);
                for (int rotation = 0; rotation <= 3; rotation++) {
                    Matrix m = new Matrix();
                    if (rotation > 0) m.setRotate(90 * rotation);
                    Bitmap smallBitmap = Bitmap.createBitmap(
                            srcBitmap, x * w, y * h,
                            w, h, m, false);
                    canvas.drawBitmap(smallBitmap,
                            (x + rotation * typeCount) * w, y * h,
                            PixelatedPaint.instance);
                }
            }
        }
        return dstBitmap;
    }

    public void showLine(RoundResult.Line line) {
        if (line == null) {
            game.antsRectangle = null;
        } else {
            game.antsRectangle = new Rect(line.x, line.y,
                    line.isHorizontal ? line.x + line.length - 1 : line.x,
                    line.isHorizontal ? line.y : line.y + line.length - 1);
            invalidate();
        }
    }

    public void addView(PixelatedTextView floatingTextView) {
        super.addView(floatingTextView);
    }

    @Override
    protected void onLayout(boolean changed, int l, int t, int r, int b) {

    }

    public static class RectangleWithText {
        public int left;
        public int top;
        public int right;
        public int bottom;
        public String text;

        public RectangleWithText(int left, int top, int right, int bottom, String text) {
            this.left = left;
            this.top = top;
            this.right = right;
            this.bottom = bottom;
            this.text = text;
        }
    }

    @Override
    protected void onDraw(Canvas canvas) {
        Piece piece = game.getCurrentPiece();
        boolean isDragging = (piece != null && game.isDraggingHand);
        if (isDragging) {
            Point tileZero = game.getTileCenter(0, 0);
            PointF handPos = game.handPos;
            int nx = Math.round(handPos.x);
            int ny = Math.round(handPos.y);
            int left = Math.round(tileZero.x + TILE_SIZE * (nx - 0.5f));
            int top = Math.round(tileZero.y + TILE_SIZE * (ny - 0.5f));
            if (nx >= 0 && ny >= 0
                    && nx <= 4 && ny <= 4) {

                boolean hasTop = piece.top != null && ny > 0,
                        hasLeft = piece.left != null && nx > 0,
                        hasRight = piece.right != null && nx < 4,
                        hasBottom = piece.bottom != null && ny < 4;

                int width = TILE_SIZE;
                int height = TILE_SIZE;
                drawPiece(canvas,
                        left, top,
                        left + width, top + height,
                        hasTop, hasLeft, hasRight, hasBottom);
            }
            invalidate();
        }
        if (game.antsRectangle != null) {
            drawTileRectangle(canvas, game.antsRectangle);
            invalidate();
        }
    }

    public void drawPiece(Canvas canvas,
                          int left, int top, int right, int bottom,
                          boolean hasTop, boolean hasLeft, boolean hasRight, boolean hasBottom) {
        this.xc = (right + left) / 2f - 0.5f * antSize;
        this.yc = (bottom + top) / 2f - 0.5f * antSize;
        // Log.d(TAG, "left:" + left + " top:" + top + " xc:" + xc + " yc:" + yc);
        this.antSize = TILE_SIZE; // TILE_SIZE;
        if (hasTop) {
            drawAnt(canvas, AntsView.ANTS_CORNER, AntsView.ROTATE_0, -1, -2);
            drawAnt(canvas, AntsView.ANTS_LEFT, AntsView.ROTATE_90, 0, -2);
            drawAnt(canvas, AntsView.ANTS_CORNER, AntsView.ROTATE_90, 1, -2);
        } else {
            drawAnt(canvas, AntsView.ANTS_LEFT, AntsView.ROTATE_90, 0, -1);
        }
//
        if (hasLeft) {
            drawAnt(canvas, AntsView.ANTS_CORNER, AntsView.ROTATE_0, -2, -1);
            drawAnt(canvas, AntsView.ANTS_LEFT, AntsView.ROTATE_0, -2, 0);
            drawAnt(canvas, AntsView.ANTS_CORNER, AntsView.ROTATE_270, -2, 1);
        } else {
            drawAnt(canvas, AntsView.ANTS_LEFT, AntsView.ROTATE_0, -1, 0);
        }
//
        if (hasRight) {
            drawAnt(canvas, AntsView.ANTS_CORNER, AntsView.ROTATE_90, 2, -1);
            drawAnt(canvas, AntsView.ANTS_LEFT, AntsView.ROTATE_180, 2, 0);
            drawAnt(canvas, AntsView.ANTS_CORNER, AntsView.ROTATE_180, 2, 1);
        } else {
            drawAnt(canvas, AntsView.ANTS_LEFT, AntsView.ROTATE_180, +1, 0);
        }

        if (hasBottom) {
            drawAnt(canvas, AntsView.ANTS_CORNER, AntsView.ROTATE_270, -1, 2);
            drawAnt(canvas, AntsView.ANTS_LEFT, AntsView.ROTATE_270, 0, 2);
            drawAnt(canvas, AntsView.ANTS_CORNER, AntsView.ROTATE_180, 1, 2);
        } else {
            drawAnt(canvas, AntsView.ANTS_LEFT, AntsView.ROTATE_270, 0, 1);
        }

        if (hasTop && hasLeft) {
            drawAnt(canvas, AntsView.ANTS_INNER_CORNER, AntsView.ROTATE_0, -1, -1);
        } else if (hasLeft) {
            drawAnt(canvas, AntsView.ANTS_LEFT, AntsView.ROTATE_90, -1, -1);
        } else if (hasTop) {
            drawAnt(canvas, AntsView.ANTS_LEFT, AntsView.ROTATE_0, -1, -1);
        } else {
            drawAnt(canvas, AntsView.ANTS_CORNER, AntsView.ROTATE_0, -1, -1);
        }
//
        if (hasTop && hasRight) {
            drawAnt(canvas, AntsView.ANTS_INNER_CORNER, AntsView.ROTATE_90, 1, -1);
        } else if (hasRight) {
            drawAnt(canvas, AntsView.ANTS_LEFT, AntsView.ROTATE_90, 1, -1);
        } else if (hasTop) {
            drawAnt(canvas, AntsView.ANTS_LEFT, AntsView.ROTATE_180, 1, -1);
        } else {
            drawAnt(canvas, AntsView.ANTS_CORNER, AntsView.ROTATE_90, 1, -1);
        }
//
        if (hasBottom && hasLeft) {
            drawAnt(canvas, AntsView.ANTS_INNER_CORNER, AntsView.ROTATE_270, -1, 1);
        } else if (hasLeft) {
            drawAnt(canvas, AntsView.ANTS_LEFT, AntsView.ROTATE_270, -1, 1);
        } else if (hasBottom) {
            drawAnt(canvas, AntsView.ANTS_LEFT, AntsView.ROTATE_0, -1, 1);
        } else {
            drawAnt(canvas, AntsView.ANTS_CORNER, AntsView.ROTATE_270, -1, 1);
        }
//
        if (hasBottom && hasRight) {
            drawAnt(canvas, AntsView.ANTS_INNER_CORNER, AntsView.ROTATE_180, 1, 1);
        } else if (hasRight) {
            drawAnt(canvas, AntsView.ANTS_LEFT, AntsView.ROTATE_270, 1, 1);
        } else if (hasBottom) {
            drawAnt(canvas, AntsView.ANTS_LEFT, AntsView.ROTATE_180, 1, 1);
        } else {
            drawAnt(canvas, AntsView.ANTS_CORNER, AntsView.ROTATE_180, 1, 1);
        }
    }

    public void drawAnt(Canvas canvas, int antNo, int rotate, float x, float y) {
        int clock = ANTS_ANIM_COUNT - 1 - ((int) (SystemClock.uptimeMillis() / 60)) % ANTS_ANIM_COUNT;
        srcRect.offsetTo((antNo + rotate * ANTS_TYPE_COUNT) * ANT_WIDTH, clock * ANT_HEIGHT);
        float dx = xc + x * antSize;
        float dy = yc + y * antSize;
        dstRect.set(dx, dy, dx + antSize, dy + antSize);
        canvas.drawBitmap(allAnts, srcRect, dstRect, PixelatedPaint.instance);
        // Paint p = new Paint();
        // p.setColor(Color.MAGENTA);
        // canvas.drawCircle(100, 100, 100, p);
    }

    public void drawTileRectangle(Canvas canvas, Rect rect) {
        this.antSize = TILE_SIZE; // TILE_SIZE;
        xc = rect.left + game.boardRect.left;
        yc = rect.top + game.boardRect.top;
        drawAnt(canvas, AntsView.ANTS_CORNER, AntsView.ROTATE_0, rect.left - 1, rect.top - 1);
        drawAnt(canvas, AntsView.ANTS_CORNER, AntsView.ROTATE_90, rect.right + 1, rect.top - 1);
        for (int l = rect.left; l <= rect.right; l++) {
            drawAnt(canvas, AntsView.ANTS_LEFT, AntsView.ROTATE_90, l, rect.top - 1);
            drawAnt(canvas, AntsView.ANTS_LEFT, AntsView.ROTATE_270, l, rect.bottom + 1);
        }
        for (int t = rect.top; t <= rect.bottom; t++) {
            drawAnt(canvas, AntsView.ANTS_LEFT, AntsView.ROTATE_0, rect.left - 1, t);
            drawAnt(canvas, AntsView.ANTS_LEFT, AntsView.ROTATE_180, rect.right + 1, t);
        }
        drawAnt(canvas, AntsView.ANTS_CORNER, AntsView.ROTATE_270, rect.left - 1, rect.bottom + 1);
        drawAnt(canvas, AntsView.ANTS_CORNER, AntsView.ROTATE_180, rect.right + 1, rect.bottom + 1);
    }
}
