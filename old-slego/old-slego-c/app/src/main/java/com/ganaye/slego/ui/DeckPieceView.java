package com.ganaye.slego.ui;

import android.content.Context;

import static com.ganaye.slego.ui.game.GameScreenLayout.DECK_TILE_SIZE;

public class DeckPieceView extends PieceView {

    public DeckPieceView(Context context) {
        super(context);
        tileSize = DECK_TILE_SIZE;
    }

    @Override
    protected TileView createTileAndAddView(Context context) {
        TileView result = new DeckTileView(context);
        addView(result);
        return result;
    }
}
