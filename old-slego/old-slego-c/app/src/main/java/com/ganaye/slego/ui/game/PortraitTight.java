package com.ganaye.slego.ui.game;

public class PortraitTight extends GameScreenLayout {

    @Override
    public int getWidth() {
        return 180;
    }

    @Override
    public int getHeight() {
        return 338;
    }

    @Override
    public void applyLayout(GameScreen gameView, int width, int height) {
        layoutBtn(gameView.backButton, EDGE_MARGIN, 8);
        layoutBtn(gameView.optionsButton, width - 23, 8);
        layoutView(gameView.logo, 29, EDGE_MARGIN, LOGO_WIDTH, LOGO_HEIGHT);
        layoutBoard((width - BOARD_WIDTH) / 2, 39, BOARD_WIDTH, BOARD_HEIGHT);
        layoutView(gameView.handView, handOnTheRightSide ? width - 93 : EDGE_MARGIN, 219, HAND_WIDTH, HAND_HEIGHT);
        layoutView(gameView.scoreView, handOnTheRightSide ? EDGE_MARGIN : 99, 219, 78, 90);
        super.setFingerOffset(0.5f, 0.5f);
    }
}

/*
 +---+ +-----------+  +---+
 | < | | Logo      | | : |
 +---+ +-----------+ +---+
 +---+---+---+---+---+
 |   |   |   |   |   |
 +---+---+---+---+---+
 |   |   |   |   |   |
 +---+---+---+---+---+
 |   |   |   |   |   |
 +---+---+---+---+---+
 |   |   |   |   |   |
 +---+---+---+---+---+
 |   |   |   |   |   |
 +---+---+---+---+---+
     +---+      Score
     |   |
 +---+   +---+
 |           |
 +---+   +---+
     |   |
     +---+
*/



