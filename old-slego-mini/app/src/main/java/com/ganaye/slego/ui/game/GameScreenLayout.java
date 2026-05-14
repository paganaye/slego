package com.ganaye.slego.ui.game;

import android.view.View;

import com.ganaye.slego.SlegoApp;

public abstract class GameScreenLayout {
    public static final int TILE_SIZE = 30;
    public static final int ROUND_BUTTON_SIZE = 20;
    public static final int EDGE_MARGIN = 3; // margin to the phone edges
    public static final int LOGO_WIDTH = 92;
    public static final int LOGO_HEIGHT = 30;

    public static final int HAND_WIDTH = 100; // 3 fullsize tiles + 1 for the ants
    public static final float ANT_SIZE = 20;
    public static final int HAND_HEIGHT = HAND_WIDTH;

    public static final int BOARD_WIDTH = 150;
    public static final int BOARD_HEIGHT = BOARD_WIDTH;

    public static final int DECK_TILE_SIZE = 9;
    public static final int DECK_PIECE_SIZE = 27;
    public static final int DECK_PIECE_GAP = 3;
    public static final int DECK_PIECE_DISTANCE = DECK_PIECE_SIZE + DECK_PIECE_GAP;

    protected boolean handOnTheRightSide;

    public abstract int getWidth();

    public abstract int getHeight();

    abstract void applyLayout(GameScreen gameView, int width, int height);

    void layoutBtn(View v, int x, int y) {
        v.layout(x, y, x + ROUND_BUTTON_SIZE, y + ROUND_BUTTON_SIZE);
    }

    void layoutView(View v, int x, int y, int w, int h) {
        v.layout(x, y, x + w, y + h);
    }


    void setFingerOffset(float x, float y) {
        SlegoApp.getInstance().fingerOffsetX = x;
        SlegoApp.getInstance().fingerOffsetY = y;
    }

    protected void layoutBoard(int x, int y, int w, int h) {
        SlegoApp.getInstance().getCurrentGame().boardRect.set(x, y, x + w, y + h);
    }
}
