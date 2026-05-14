package com.ganaye.slego.model;

public class Piece {
    static int PERCENT_CHANCE_TO_GET_EMPTY_TILE = 25;
    public final TileImage top;
    public final TileImage left;
    public final TileImage center;
    public final TileImage right;
    public final TileImage bottom;

    public Piece(TileImage top, TileImage left, TileImage center, TileImage right, TileImage bottom) {
        this.top = top;
        this.left = left;
        this.center = center;
        this.right = right;
        this.bottom = bottom;
    }
}


