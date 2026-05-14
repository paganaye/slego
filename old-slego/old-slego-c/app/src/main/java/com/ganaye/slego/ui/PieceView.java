package com.ganaye.slego.ui;

import android.content.Context;

import com.ganaye.core.MutableValue;
import com.ganaye.slego.model.Piece;
import com.ganaye.slego.model.TileImage;

import static com.ganaye.slego.ui.game.GameScreenLayout.TILE_SIZE;

public class PieceView extends PixelatedViewGroup {
    private static final String TAG = "PieceView";
    final TileView topView;
    final TileView leftView;
    final TileView centerView;
    final TileView rightView;
    final TileView bottomView;
    private MutableValue<Piece> piece = new MutableValue<>(this, null);
    protected int tileSize = TILE_SIZE;
    private boolean revealed = true;

    private float xc, yc;


    public PieceView(Context context) {
        super(context);
        topView = createTileAndAddView(context);
        leftView = createTileAndAddView(context);
        centerView = createTileAndAddView(context);
        rightView = createTileAndAddView(context);
        bottomView = createTileAndAddView(context);
    }

    protected TileView createTileAndAddView(Context context) {
        TileView result = new TileView(context);
        addView(result);
        return result;
    }

    @Override
    protected void onLayout(boolean changed, int left, int top, int right, int bottom) {
        this.xc = getWidth() / 2f - tileSize / 2f;
        this.yc = getHeight() / 2f - tileSize / 2f;
        layoutTile(this.topView, 0, -1);
        layoutTile(this.leftView, -1, 0);
        layoutTile(this.centerView, 0, 0);
        layoutTile(this.rightView, 1, 0);
        layoutTile(this.bottomView, 0, 1);
    }

    private void layoutTile(TileView tile, int x, int y) {
        int nl = Math.round(xc + tileSize * x);
        int nt = Math.round(yc + tileSize * y);
        int nr = Math.round(xc + tileSize * (x + 1));
        int nb = Math.round(yc + tileSize * (y + 1));
        tile.layout(nl, nt, nr, nb);
    }

    public void setPiece(Piece newPiece, boolean revealed) {
         Piece previousPiece = this.piece.getValue();
        this.piece.setValue(newPiece);
        this.revealed = revealed;
        refreshTiles();
    }


    public void refreshTiles() {
        final Piece piece = this.piece.getValue();
        this.setScaleX(revealed ? 1f : -1f);
        if (piece != null && revealed) {
            topView.setTileImage(piece.top);
            leftView.setTileImage(piece.left);
            centerView.setTileImage(piece.center);
            rightView.setTileImage(piece.right);
            bottomView.setTileImage(piece.bottom);
        } else {
            topView.setTileImage(piece == null || piece.top != null ? TileImage.Back : null);
            leftView.setTileImage(piece == null || piece.left != null ? TileImage.Back : null);
            centerView.setTileImage(TileImage.Back);
            rightView.setTileImage(piece == null || piece.right != null ? TileImage.Back : null);
            bottomView.setTileImage(piece == null || piece.bottom != null ? TileImage.Back : null);
        }
    }

    public TileView getTileView(int hx, int hy) {
        if (hx == 0 && hy == -1) return topView;
        else if (hx == -1 && hy == 0) return leftView;
        else if (hx == 0 && hy == 0) return centerView;
        else if (hx == 1 && hy == 0) return rightView;
        else if (hx == 0 && hy == 1) return bottomView;
        else return null;
    }

    public void reveal() {
        if (!revealed) {
            this.revealed = true;
            refreshTiles();
        }
    }
}