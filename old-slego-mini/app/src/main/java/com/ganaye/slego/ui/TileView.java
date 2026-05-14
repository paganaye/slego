package com.ganaye.slego.ui;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.drawable.Drawable;

import com.ganaye.slego.R;
import com.ganaye.slego.model.TileImage;
import com.ganaye.slego.ui.game.PlayAnimations;

public class TileView extends PixelatedImageView {

    public TileView(Context context) {
        super(context);
    }

    protected int getResourceId(TileImage shape) {
        switch (shape) {
            case Cross:
                return R.drawable.tile_cross;
            case Circle:
                return R.drawable.tile_circle;
            case Triangle:
                return R.drawable.tile_triangle;
            case Square:
                return R.drawable.tile_square;
            case Back:
                return R.drawable.tile_back;
            default:
                return R.drawable.tile_empty;
        }
    }

    @Override
    public Drawable getBackground() {
        return super.getBackground();
    }

    public void setTileImage(TileImage tileImage) {
        if (tileImage != null) {
            super.setBitmapResourceId(getResourceId(tileImage));
            PlayAnimations.resetView(this);
        } else {
            this.setVisibility(INVISIBLE);
        }
        this.invalidate();
    }


}
