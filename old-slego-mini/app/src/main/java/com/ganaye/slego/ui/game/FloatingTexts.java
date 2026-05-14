package com.ganaye.slego.ui.game;

import android.animation.Animator;
import android.animation.AnimatorListenerAdapter;
import android.animation.AnimatorSet;
import android.animation.ObjectAnimator;
import android.content.Context;
import android.graphics.Point;
import android.view.View;
import android.view.ViewGroup;

import com.ganaye.slego.model.Game;
import com.ganaye.slego.ui.Font;
import com.ganaye.slego.ui.PixelatedTextView;
import com.ganaye.slego.ui.PixelatedViewGroup;

import java.util.ArrayList;

import static com.ganaye.slego.SlegoApp.ANIMATION_MULTIPLIER;

public class FloatingTexts extends PixelatedViewGroup {
    private final GameScreen gameScreen;
    private final Game game;
    final static int MOVING_TEXT_DELAY = 75 * ANIMATION_MULTIPLIER;
    final static int SCORE_TEXT_MOVE_DURATION = 25 * ANIMATION_MULTIPLIER;
    ArrayList<View> views = new ArrayList();

    public FloatingTexts(Context context, GameScreen gameScreen, Game game) {
        super(context);
        this.gameScreen = gameScreen;
        this.game = game;
    }

    public void incrementTargetPos() {
        currentPos += Font.smallOutlined().fontLeading;
    }

    private int currentPos = 0;

    public Point getTargetPos() {
        return new Point(
                game.handHome.left,
                currentPos + game.handHome.top);
    }

    public void clear() {
        currentPos = 0;
        while (views.size() > 0) {
            View v = views.get(views.size() - 1);
            ((ViewGroup) v.getParent()).removeView(v);
            views.remove(v);
        }
    }

    public PixelatedTextView getNew() {
        PixelatedTextView floatingTextView = new PixelatedTextView(gameScreen.getContext());
        return floatingTextView;
    }

    public PixelatedTextView newFrom(int x1, int y1, String text, Runnable followedBy, int delay) {
        PixelatedTextView floatingTextView = getNew();
        floatingTextView.layout(x1, y1, x1 + 150, y1 + 20);
        floatingTextView.setText(text);
        floatingTextView.setVisibility(VISIBLE);
        Point targetPos = getTargetPos();
        float dx = targetPos.x - x1;
        float dy = targetPos.y - y1;
        AnimatorSet moveTextSubset = new AnimatorSet();
        if (dx == 0 && dy == 0) {
            floatingTextView.setAlpha(0f);
            ObjectAnimator as = ObjectAnimator.ofFloat(floatingTextView, View.ALPHA, 0, 1).setDuration(SCORE_TEXT_MOVE_DURATION);
            moveTextSubset.setStartDelay(delay);
            moveTextSubset.playTogether(as);
        } else {
            ObjectAnimator xs = ObjectAnimator.ofFloat(floatingTextView, View.TRANSLATION_X, 0, dx).setDuration(SCORE_TEXT_MOVE_DURATION);
            ObjectAnimator ys = ObjectAnimator.ofFloat(floatingTextView, View.TRANSLATION_Y, 0, dy).setDuration(SCORE_TEXT_MOVE_DURATION);
            moveTextSubset.setStartDelay(delay);
            moveTextSubset.playTogether(xs, ys);
        }
        moveTextSubset.start();
        gameScreen.addView(floatingTextView);
        moveTextSubset.addListener(new AnimatorListenerAdapter() {
            @Override
            public void onAnimationEnd(Animator animation) {
                if (followedBy != null) followedBy.run();
            }
        });
        incrementTargetPos();
        views.add(floatingTextView);
        return floatingTextView;
    }

    public void addNew(String text, Runnable followedBy, int delay) {
        Point target = getTargetPos();
        newFrom(target.x, target.y, text, followedBy, delay);
    }

    @Override
    protected void onLayout(boolean changed, int l, int t, int r, int b) {

    }
}
