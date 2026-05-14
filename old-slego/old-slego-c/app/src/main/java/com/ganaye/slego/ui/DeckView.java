package com.ganaye.slego.ui;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Color;

import com.ganaye.slego.model.Game;

import static com.ganaye.slego.ui.game.GameScreenLayout.DECK_PIECE_DISTANCE;

public class DeckView extends PixelatedViewGroup {
    final DeckPieceView[] pieceViews;
    private final Game game;
    private int columnCount = 5;

    @Override
    protected void onSizeChanged(int w, int h, int oldw, int oldh) {
        super.onSizeChanged(w, h, oldw, oldh);
        columnCount = (w >= h) ? 8 : 5;
    }

    public DeckView(Context context, Game game) {
        super(context);
        pieceViews = new DeckPieceView[game.roundCount];
        this.game = game;
        for (int i = 0; i < game.roundCount; i++) {
            DeckPieceView pieceView = new DeckPieceView(context);
            addView(pieceView);
            pieceViews[i] = pieceView;
            pieceViews[i].setPiece(game.getPiece(i), false);
        }
        setWillNotDraw(false);
    }


    @Override
    protected void onLayout(boolean changed, int left, int top, int right, int bottom) {
        int pieceSize = DECK_PIECE_DISTANCE;

        for (int i = 0; i < game.roundCount; i++) {
            int x = i % columnCount;
            int y = i / columnCount;
            DeckPieceView pieceView = pieceViews[i];
            int nleft = x * pieceSize;
            int ntop = y * pieceSize;
            pieceView.layout(nleft, ntop, nleft + pieceSize, ntop + pieceSize);
        }
    }

    @Override
    protected void onDraw(Canvas canvas) {
        canvas.drawColor(Color.BLACK);
        super.onDraw(canvas);
    }

    public PieceView getPieceView(Integer pieceNo) {
        return (pieceNo >= 0 && pieceNo < pieceViews.length)
                ? pieceViews[pieceNo] : null;
    }
}
