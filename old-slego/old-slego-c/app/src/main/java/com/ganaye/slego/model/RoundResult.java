package com.ganaye.slego.model;

import java.util.ArrayList;
import java.util.List;

import static com.ganaye.slego.model.Game.getTileNo;

public class RoundResult {
    private final TileImage[] originalTileImages = new TileImage[25];
    private final TileImage[] newTileImages = new TileImage[25];
    private final BoardTile[] _boardTiles;
    public final ArrayList<HandTile> handTiles = new ArrayList<>();
    public final ArrayList<HandTile> replacedTiles = new ArrayList<>();
    public final ArrayList<Line> lines = new ArrayList<>();
    public final int originalScore;
    public final int linesPoints;
    public final int nbLines;
    public final int total;
    public final boolean hasComplexTotal;
    public final int handX, handY;
    public final Piece piece;
    public final int newScore;
    public final int linesBonus;

    public RoundResult(BoardTile[] boardTiles, int roundNumber, Piece piece, int handX, int handY, int originalScore) {
        this._boardTiles = boardTiles;
        for (int i = 0; i < 25; i++) {
            TileImage currentImage = boardTiles[i].getTileImage();
            originalTileImages[i] = currentImage;
            newTileImages[i] = currentImage;
        }
        this.handX = handX;
        this.handY = handY;
        this.piece = piece;
        this.originalScore = originalScore;
        play();
        this.linesPoints = calcLinePoints();
        nbLines = lines.size();
        linesBonus = nbLines > 1 ? (nbLines - 1) * linesPoints : 0;

        total = linesPoints + linesBonus - replacedTiles.size();
        hasComplexTotal = (nbLines > 1) || (nbLines == 1 && replacedTiles.size() > 0);
        int newScore = originalScore + total;
        if (newScore < 0) newScore = 0;
        clearCompletedLines();
        this.newScore = newScore;
    }

    private void clearCompletedLines() {
        for (int i = 0; i < lines.size(); i++) {
            Line line = lines.get(i);
            for (int j = 0; j < line.tiles.size(); j++) {
                LineTile tile = line.tiles.get(j);
                newTileImages[tile.tileNo] = null;
            }
        }
    }

    private void play() {
        replaceTile(handX, handY - 1, 0, -1, piece.top);
        replaceTile(handX - 1, handY, -1, 0, piece.left);
        replaceTile(handX, handY, 0, 0, piece.center);
        replaceTile(handX + 1, handY, 1, 0, piece.right);
        replaceTile(handX, handY + 1, 0, 1, piece.bottom);

        searchHorizontalLine(handY - 1);
        searchHorizontalLine(handY);
        searchHorizontalLine(handY + 1);
        searchVerticalLine(handX - 1);
        searchVerticalLine(handX);
        searchVerticalLine(handX + 1);
    }

    private void searchHorizontalLine(int y) {
        if (y < 0 || y > 4) return;
        searchLine(true, y,
                getNewImage(0, y), getNewImage(1, y), getNewImage(2, y), getNewImage(3, y), getNewImage(4, y));
    }

    private void searchVerticalLine(int x) {
        if (x < 0 || x > 4) return;
        searchLine(false, x,
                getNewImage(x, 0), getNewImage(x, 1), getNewImage(x, 2), getNewImage(x, 3), getNewImage(x, 4));
    }

    private void searchLine(
            boolean isHorizontal, int lineNo,
            TileImage s0, TileImage s1, TileImage s2, TileImage s3, TileImage s4) {
        if (s2 == null) return;
        int from = (s1 == s2) ? (s0 == s2) ? 0 : 1 : 2;
        int to = (s3 == s2) ? (s4 == s2) ? 4 : 3 : 2;
        if ((to - from) >= 2) {
            lines.add(new Line(isHorizontal, lineNo, from, to, s2));
        }
    }

    private TileImage getNewImage(int x, int y) {
        return newTileImages[getTileNo(x, y)];
    }


    private void replaceTile(int x, int y, int hx, int hy, TileImage newShape) {
        if (newShape == null) return;
        HandTile handTile = new HandTile(x, y, hx, hy, newShape);
        handTiles.add(handTile);
        if (handTile.isInBoard) {
            if (handTile.isReplacingOriginalTile) {
                replacedTiles.add(handTile);
            }
            newTileImages[handTile.tileNo] = newShape;
        }
    }

    private int calcLinePoints() {
        int nbLines = lines.size();
        int linesPoints = 0;
        for (int i = 0; i < nbLines; i++) {
            linesPoints += lines.get(i).points;
        }
        return linesPoints;
    }

    public class HandTile {
        public final int x, y;
        public final int hx, hy;
        public final BoardTile boardTile;
        public final TileImage originalShape;
        public final TileImage newShape;
        public final boolean isInBoard;
        public final boolean isReplacingOriginalTile;
        private final int tileNo;

        public HandTile(int x, int y, int hx, int hy, TileImage newShape) {
            this.x = x;
            this.y = y;
            this.hx = hx;
            this.hy = hy;
            this.newShape = newShape;
            if (x >= 0 && y >= 0 && x <= 4 && y <= 4) {
                isInBoard = true;
                this.tileNo = getTileNo(x, y);
                this.originalShape = originalTileImages[tileNo];
                this.boardTile = _boardTiles[tileNo];
                this.isReplacingOriginalTile = (originalShape != null);
            } else {
                isInBoard = false;
                originalShape = null;
                tileNo = -1;
                this.boardTile = null;
                isReplacingOriginalTile = false;
            }
        }
    }

    public class LineTile {
        public int tileNo;
        public final BoardTile boardTile;
        public int lineCount;

        public LineTile(int tileNo) {
            this.tileNo = tileNo;
            this.boardTile = _boardTiles[tileNo];
        }
    }

    public class Line {
        public final boolean isHorizontal;
        public final List<LineTile> tiles;
        public final int x, y, length;
        public final int points;
        public final TileImage shape;
        public final String text;

        public Line(boolean isHorizontal, int lineNo, int from, int to, TileImage shape) {
            this.isHorizontal = isHorizontal;
            ArrayList<RoundResult.LineTile> tiles = new ArrayList<>();
            if (isHorizontal) {
                x = from;
                y = lineNo;
            } else {
                x = lineNo;
                y = from;
            }
            length = to - from + 1;
            for (int i = from; i <= to; i++) {
                int tileNo = (isHorizontal
                        ? getTileNo(i, lineNo)
                        : getTileNo(lineNo, i));
                LineTile lineTile = getLineTile(tileNo);
                lineTile.lineCount += 1;
                tiles.add(lineTile);
            }
            switch (length) {
                case 3:
                    text = "Short line 10 points";
                    points = 10;
                    break;
                case 4:
                    text = "Medium line 20 points";
                    points = 20;
                    break;
                case 5:
                    text = "Long line 30 points";
                    points = 30;
                    break;
                default:
                    text = "???";
                    points = 0;
            }
            this.shape = shape;
            this.tiles = tiles;
        }
    }

    private LineTile getLineTile(int tileNo) {
        for (int i = 0; i < lines.size(); i++) {
            Line line = lines.get(i);
            for (int j = 0; j < line.tiles.size(); j++) {
                LineTile lineTile = line.tiles.get(j);
                if (lineTile.tileNo == tileNo) return lineTile;
            }
        }
        return new LineTile(tileNo);
    }

    public TileImage getOriginalTileImage(int i) {
        return originalTileImages[i];
    }

    public TileImage getNewTileImage(int i) {
        return newTileImages[i];
    }
}

