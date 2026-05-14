package com.ganaye.slego.ui;

import android.annotation.SuppressLint;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.widget.FrameLayout;

import com.ganaye.core.IDisposable;
import com.ganaye.core.PixelatedView;
import com.ganaye.slego.model.Game;
import com.ganaye.slego.ui.game.GameScreenLayout;
import com.ganaye.slego.ui.game.LandscapeTight;
import com.ganaye.slego.ui.game.PortraitTight;

// A scroll layout wil ad linear layout
// used to make simple scrollable pages like main menu and about page.
@SuppressLint("ViewConstructor")
public class AppFrame extends ViewGroup implements IDisposable {
    private static final String TAG = "AppFrame";
    public final IScreen screen;
    public final MainActivity mainActivity;
    public final View gameScreenRootView;
    final GameScreenLayout[] layouts = {new PortraitTight(), new LandscapeTight()};
    private final BackgroundEffect backgroundEffect;
    private final Game game;
    private boolean isDisposed;

    public AppFrame(MainActivity mainActivity, Game game, IScreen screen) { // , NavigateAnimation enterAnimation
        super(mainActivity);
        this.game = game;
        Log.d(TAG, "Constructor");
        //this.enterAnimation = enterAnimation;
        this.mainActivity = mainActivity;
        this.screen = screen;
        backgroundEffect = screen.getBackgroundEffect();
        if (backgroundEffect != null) addView(backgroundEffect);
        gameScreenRootView = screen.getView();
        addView(gameScreenRootView);
    }


    @Override
    public void dispose() {
        Log.d(TAG, "Disposing AppFrame");
        if (!isDisposed) {
            isDisposed = true;
            PixelatedView.disposeChildren(this);
        }
    }

    @Override
    public boolean isDisposed() {
        return isDisposed;
    }


    @Override
    protected FrameLayout.LayoutParams generateDefaultLayoutParams() {
        return new FrameLayout.LayoutParams(FrameLayout.LayoutParams.MATCH_PARENT, FrameLayout.LayoutParams.WRAP_CONTENT);
    }

    @Override
    protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
        super.onMeasure(widthMeasureSpec, heightMeasureSpec);
        int w = MeasureSpec.getSize(widthMeasureSpec);
        int h = MeasureSpec.getSize(heightMeasureSpec);
        setMeasuredDimension(w, h);
    }

    private void findBestLayout(int availableWidth, int availableHeight) {
        float bestPixelSize = 6f;
        GameScreenLayout bestLayout = null;
        for (GameScreenLayout layout : layouts) {
            float layoutWidth = layout.getWidth();
            float layoutHeight = layout.getHeight();
            float scaleX = availableWidth / layoutWidth;
            float scaleY = availableHeight / layoutHeight;
            float proposedPixelSize = Math.min(scaleX, scaleY);
            if (bestLayout == null || proposedPixelSize > bestPixelSize) {
                bestPixelSize = proposedPixelSize;
                bestLayout = layout;
            }
        }
        float pixelSize = bestPixelSize;
        game.gameLayout = bestLayout;
        game.pixelSize = pixelSize;
        game.pxWidth = (int) Math.ceil(availableWidth / pixelSize);
        game.pxHeight = (int) Math.ceil(availableHeight / pixelSize);
    }

    @Override
    protected void onLayout(boolean changed, int left, int top, int right, int bottom) {
        if (changed) {
            int w = right - left;
            int h = bottom - top;
            if (w == 0 || h == 0) return;
            findBestLayout(w, h);

            backgroundEffect.layout(0, 0, game.pxWidth, game.pxHeight);
            backgroundEffect.setPivotX(0);
            backgroundEffect.setPivotY(0);
            backgroundEffect.setScaleX(game.pixelSize);
            backgroundEffect.setScaleY(game.pixelSize);

            gameScreenRootView.measure(game.pxWidth, game.pxHeight);

            gameScreenRootView.setPivotX(0);
            gameScreenRootView.setPivotY(0);
            gameScreenRootView.setScaleX(game.pixelSize);
            gameScreenRootView.setScaleY(game.pixelSize);
            gameScreenRootView.layout(0, 0, game.pxWidth, game.pxHeight);
        }
    }

    @Override
    protected void onSizeChanged(int w, int h, int oldW, int oldH) {
        super.onSizeChanged(w, h, oldW, oldH);
        Log.d(TAG, "onSizeChanged w:" + w + " h:" + h);
        //if (enterAnimation != null) {
        //SlegoApp.setEnterAnimation(enterAnimation, this, w, h);
        //enterAnimation = null;
        //}
    }
}

