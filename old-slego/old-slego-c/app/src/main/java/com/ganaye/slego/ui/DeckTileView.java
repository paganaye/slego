package com.ganaye.slego.ui;

import android.content.Context;

import com.ganaye.slego.R;
import com.ganaye.slego.model.TileImage;

public class DeckTileView extends TileView {

    public DeckTileView(Context context) {
        super(context);
    }

    @Override
    protected int getResourceId(TileImage shape) {
        switch (shape) {
            case Cross:
                return R.drawable.deck_cross;
            case Circle:
                return R.drawable.deck_circle;
            case Triangle:
                return R.drawable.deck_triangle;
            case Square:
                return R.drawable.deck_square;
            default:
                return R.drawable.deck_back;
        }
    }

}
