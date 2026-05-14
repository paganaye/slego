package com.ganaye.slego.ui;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.drawable.BitmapDrawable;

import com.ganaye.core.Observable;
import com.ganaye.slego.R;
import com.ganaye.slego.model.BoardTile;
import com.ganaye.slego.model.Game;
import com.ganaye.slego.model.GameUIState;
import com.ganaye.slego.model.RoundResult;
import com.ganaye.slego.model.TileImage;

import static com.ganaye.slego.ui.game.GameScreenLayout.TILE_SIZE;

public class BoardView extends PixelatedViewGroup {
    final TileView[] tiles = new TileView[25];
    private final Game game;
    private float tileSizePx;

    public BoardView(Context context, Game game) {
        super(context);
        this.game = game;
        RoundResult roundResult = game.getRoundResult();

        for (int i = 0; i < 25; i++) {
            TileView tile = new TileView(context);
            addView(tile);
            tiles[i] = tile;
            BoardTile boardTile = game.getBoardTile(i);
            Observable<TileImage> tileImage = boardTile.tileImage;
            tileImage.addObserverAndRun(this, () -> {
                TileImage tileImageValue;
                tileImageValue = tileImage.getValue();
                if (tileImageValue == null) tileImageValue = TileImage.Empty;
                tile.setTileImage(tileImageValue);
            });
            if (roundResult != null) {
                tile.setTileImage(roundResult.getNewTileImage(i));
            }
            game.gameState.addObserverAndRun(this, this::onGameStateChanged);
        }
        setWillNotDraw(false);
    }

    public void onGameStateChanged() {
        GameUIState gameStateValue = game.gameState.getValue();
        switch (gameStateValue) {
            case waitingForPlayerToCompleteRound:
                for (int i = 0; i < 25; i++) {
                    TileView tile = tiles[i];
                    BoardTile boardTile = game.getBoardTile(i);
                    boardTile.tileImage.getValue();
                }
                break;
            case showingNextPiece:
                for (int i = 0; i < 25; i++) {
                    TileView tile = tiles[i];
                }
                break;
        }
    }

    @Override
    protected void onDraw(Canvas canvas) {
        int ox = game.boardRect.left;
        int oy = game.boardRect.top;
        for (int y = 0; y < 5; y++) {
            for (int x = 0; x < 5; x++) {
                int nleft = ox + Math.round(x * tileSizePx);
                int ntop = oy + Math.round(y * tileSizePx);
                canvas.drawBitmap(
                        ((BitmapDrawable) getResources().getDrawable(R.drawable.tile_empty)).getBitmap(),
                        nleft, ntop, PixelatedPaint.instance);
            }
        }
        super.onDraw(canvas);
    }

    @Override
    protected void onLayout(boolean changed, int left, int top, int right, int bottom) {
        tileSizePx = TILE_SIZE;
        int ox = game.boardRect.left;
        int oy = game.boardRect.top;

        for (int i = 0; i < 25; i++) {
            int x = i % 5;
            int y = i / 5;
            TileView tile = tiles[i];
            int nleft = ox + Math.round(x * tileSizePx);
            int ntop = oy + Math.round(y * tileSizePx);
            int nright = ox + Math.round(x * tileSizePx + tileSizePx);
            int nbottom = oy + Math.round(y * tileSizePx + tileSizePx);
            tile.layout(nleft, ntop, nright, nbottom);
        }
    }

    public TileView getTileView(BoardTile boardTile) {
        return getTileView(boardTile.x, boardTile.y);
    }

    public TileView getTileView(int x, int y) {
        return tiles[Game.getTileNo(x, y)];
    }

}
