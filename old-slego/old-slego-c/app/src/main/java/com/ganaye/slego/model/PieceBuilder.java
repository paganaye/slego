package com.ganaye.slego.model;


import java.util.Random;

import static com.ganaye.slego.SlegoApp.TILE_IMAGE_COUNT;

public class PieceBuilder {
    static final int PERCENT_CHANCE_TO_GET_EMPTY_TILE = 25;
    private final Random random;

    public PieceBuilder(long seed) {
        this.random = new Random(seed);
    }

    private TileImage randomShape() {
        int imageNo = random.nextInt(TILE_IMAGE_COUNT);
        switch (imageNo) {
            case 0:
                return TileImage.Circle;
            case 1:
                return TileImage.Cross;
            case 2:
                return TileImage.Square;
            default:
                return TileImage.Triangle;
        }
    }

    public Piece nextRandomPiece() {
        return new Piece(
                randomOrEmptyShape(),
                randomOrEmptyShape(),
                randomShape(), // center is never empty
                randomOrEmptyShape(),
                randomOrEmptyShape());
    }

    private TileImage randomOrEmptyShape() {
        int x = random.nextInt(100);
        if (x < PERCENT_CHANCE_TO_GET_EMPTY_TILE) return null;
        else return randomShape();
    }
}

