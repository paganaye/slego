package com.ganaye.slego.ui;

import android.content.Context;
import android.graphics.Canvas;

import com.ganaye.slego.model.Game;

public class ScoreView extends PixelatedTextView {
    private final Game game;

    public ScoreView(Context context, Game game) {
        super(context, "0 Point", Font.smallOutlined());
        this.game = game;
        this.setTextColor(0);
        fontPainter = FontPainter.get(Font.largeOutlined());
        game.message.addObserverAndRun(this, () -> {
            super.setText(game.message.getValue());
        });
    }


    @Override
    protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
        super.onMeasure(widthMeasureSpec, heightMeasureSpec);
    }

    @Override
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);
    }
}