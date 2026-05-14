package com.ganaye.slego.ui;

import android.content.Context;

import com.ganaye.slego.model.BoardTile;
import com.ganaye.slego.model.Game;
import com.ganaye.slego.model.GameUIState;

public class HandView extends PieceView {
    private final Game game;

    public HandView(Context context, Game game) {
        super(context);
        this.game = game;
        setFocusable(true);
        setFocusableInTouchMode(true);
        game.gameState.addObserverAndRun(this, this::onGameStateChanged);
    }

    public void onGameStateChanged() {
        GameUIState gameStateValue = game.gameState.getValue();
        switch (gameStateValue) {
            case waitingForPlayerToCompleteRound:
                setVisibility(INVISIBLE);
                break;
            case waitingForPlayerToPlay:
                setPiece(game.getCurrentPiece(), true);
                moveToHome();
                break;
        }
    }

    public void moveToHome() {
        layout(game.handHome.left, game.handHome.top, game.handHome.right, game.handHome.bottom);
        setVisibility(VISIBLE);
    }

}