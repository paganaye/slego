package com.ganaye.slego.ui.game;

public class LandscapeTight extends GameScreenLayout {

    @Override
    public int getWidth() {
        return 276;
    }

    @Override
    public int getHeight() {
        return 206;
    }

    @Override
    public void applyLayout(GameScreen gameView, int width, int height) {
        int x0 = handOnTheRightSide ? width - EDGE_MARGIN - HAND_WIDTH : EDGE_MARGIN;
        layoutBtn(gameView.backButton, x0, EDGE_MARGIN);
        layoutBtn(gameView.optionsButton, x0 + 70, EDGE_MARGIN);
        layoutView(gameView.logo, x0, 29, LOGO_WIDTH, LOGO_HEIGHT);
        layoutView(gameView.scoreView, x0, 65, 90, 16);
        layoutBoard(handOnTheRightSide ? EDGE_MARGIN : 99, (height - BOARD_WIDTH) / 2, BOARD_WIDTH, BOARD_HEIGHT);
        layoutView(gameView.handView, x0, height - 116, HAND_WIDTH, HAND_HEIGHT);
        super.setFingerOffset(0.5f, 0.5f);
    }

/* Landscape
 +---+  +---+
 | < |  | > |
 +---+  +---+
 +-----------+ +---+---+---+---+---+
 + Logo      | |   |   |   |   |   |
 +-----------+ +---+---+---+---+---+
 +-----------+ |   |   |   |   |   |
 + Score     | +---+---+---+---+---+
 +-----------+ |   |   |   |   |   |
     +---+     +---+---+---+---+---+
     |   |     |   |   |   |   |   |
 +---+   +---+ +---+---+---+---+---+
 |           | |   |   |   |   |   |
 +---+   +---+ +---+---+---+---+---+
     |   |
     +---+
*/


}
