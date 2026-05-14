package com.ganaye.slego3.views;

import android.content.Context;
import android.util.AttributeSet;
import android.widget.RelativeLayout;

import com.ganaye.slego3.scores.Round;
import com.ganaye.slego3.scores.RoundLine;

/**
 * Created by pascal on 13/01/2017.
 */
public class Board extends RelativeLayout {
    Tile[][] tileArray;
    Tile[][] backgroundArray;
    private int tileWidth;

    public Board(Context context, AttributeSet attrs) {
        super(context, attrs);

        tileArray = new Tile[5][5];
        backgroundArray = new Tile[5][5];

        for (int y = 0; y < 5; y++) {
            for (int x = 0; x < 5; x++) {
                backgroundArray[x][y] = new Tile(context, attrs);
                backgroundArray[x][y].setColor(-1, true);
                this.addView(backgroundArray[x][y]);
            }
        }
        for (int y = 0; y < 5; y++) {
            for (int x = 0; x < 5; x++) {
                tileArray[x][y] = new Tile(context, attrs);
                this.addView(tileArray[x][y]);
            }
        }
    }

    @Override
    protected void onLayout(boolean changed, int l, int t, int r, int b) {

        int w = r - l;
        int h = b - t;

        int lf = w < h ? w : h;

        int ln1 = lf / 5;

        tileWidth = ln1;

        if (tileArray == null || tileArray[0][0] == null)
            return;
        for (int y = 0; y < 5; y++) {
            for (int x = 0; x < 5; x++) {
                backgroundArray[x][y].layout(x * ln1, y * ln1, x * ln1 + ln1, y
                        * ln1 + ln1);
                tileArray[x][y].layout(x * ln1, y * ln1, x * ln1 + ln1, y * ln1
                        + ln1);
            }
        }
    }

    public Boolean isValid(int X, int Y) {
        return (X >= 0 && Y >= 0 && X <= 4 && Y <= 4);
    }

    public boolean isBlank(int X, int Y) {
        if (!isValid(X, Y))
            return false;
        Tile playedTile = tileArray[X][Y];
        return playedTile.IsBlank();
    }

    public void play1(int X, int Y, Tile crossTile) {
        if (X < 0 || Y < 0 || X > 4 || Y > 4)
            return;
        if (!crossTile.IsBlank()) {
            Tile playedTile = tileArray[X][Y];
            playedTile.setColor(crossTile.getColor(), true);
        }
    }

    public void checkLines(Round result, int XMIN, int XMAX, int YMIN, int YMAX) {
        int x;
        int y;
        int midColor;

        if (XMIN < 0)
            XMIN = 0;
        if (XMAX > 4)
            XMAX = 4;

        if (YMIN < 0)
            YMIN = 0;
        if (YMAX > 4)
            YMAX = 4;

        // search for horizontal lines

        for (y = YMIN; y <= YMAX; y++) {
            midColor = tileArray[2][y].getColor();
            if (midColor > 0) {
                int start;
                int end;

                if (tileArray[1][y].getColor() == midColor) {
                    if (tileArray[0][y].getColor() == midColor)
                        start = 0;
                    else
                        start = 1;
                } else
                    start = 2;

                if (tileArray[3][y].getColor() == midColor) {
                    if (tileArray[4][y].getColor() == midColor)
                        end = 4;
                    else
                        end = 3;
                } else
                    end = 2;

                int len = (end - start) + 1;
                if (len >= 3) {
                    result.scoreLines.add(new RoundLine(start, y, midColor,
                            true, len));
                }
            }
        }
        // search for verticals
        for (x = XMIN; x <= XMAX; x++) {
            midColor = tileArray[x][2].getColor();
            if (midColor > 0) {
                int start;
                int end;

                if (tileArray[x][1].getColor() == midColor) {
                    if (tileArray[x][0].getColor() == midColor)
                        start = 0;
                    else
                        start = 1;
                } else
                    start = 2;

                if (tileArray[x][3].getColor() == midColor) {
                    if (tileArray[x][4].getColor() == midColor)
                        end = 4;
                    else
                        end = 3;
                } else
                    end = 2;

                int len = (end - start) + 1;
                if (len >= 3) {
                    // we got a line
                    result.scoreLines.add(new RoundLine(x, start, midColor,
                            false, len));
                }
            }
        }
        for (RoundLine line : result.scoreLines) {

            for (int i = 0; i < line.length; i++) {
                Tile t = (line.isHorizontal ? tileArray[line.x + i][line.y]
                        : tileArray[line.x][line.y + i]);
                t.clearAfterAnimation();
            }
        }
    }

    public void clear() {
        for (int y = 0; y < 5; y++) {
            for (int x = 0; x < 5; x++) {
                Tile t = tileArray[x][y];
                t.setColor(0, true);
            }
        }

    }

    public int getTileWidth() {
        return tileWidth;
    }

    public int getTileHeight() {
        return tileWidth;
    }

    public int[] getBoardColors() {
        int[] boardColors = new int[25];
        for (int i = 0; i < 5; i++) {
            for (int j = 0; j < 5; j++) {
                Tile t = tileArray[i][j];
                int c = t.getColor();
                boardColors[i * 5 + j] = c;
            }
        }
        return boardColors;
    }

    public void setBoardColors(int[] boardColors) {
        for (int i = 0; i < 5; i++)
            for (int j = 0; j < 5; j++)
                tileArray[i][j].setColor(boardColors[i * 5 + j], true);
    }

    private void setHighlight(int X, int Y, boolean value) {
        if (X < 0 || Y < 0 || X > 4 || Y > 4)
            return;
        Tile playedTile = tileArray[X][Y];
        playedTile.setHighlight(true);
    }

    private void ClearHighlighted() {
        for (int i = 0; i < 5; i++)
            for (int j = 0; j < 5; j++) {
                tileArray[i][j].setHighlight(false);
            }
    }

    public void setStringValue(String string) {
        int i = 0;
        for (int y = 0; y < 5; y++) {
            for (int x = 0; x < 5; x++) {
                if (i < string.length()) {
                    String s1 = string.substring(i, i + 1);
                    tileArray[x][y].setColor(Integer.parseInt(s1), true);
                }
                i++;
            }
        }
    }

    public String getValueString() {
        StringBuilder result = new StringBuilder();
        for (int y = 0; y < 5; y++) {
            for (int x = 0; x < 5; x++) {
                Tile t = tileArray[x][y];
                result.append(t.getColor());
            }
        }
        return result.toString();
    }

    public void stopAnimatedTiles() {
        for (int y = 0; y < 5; y++) {
            for (int x = 0; x < 5; x++) {
                Tile t = tileArray[x][y];
                t.stopAnimation();
            }
        }
    }

    public Tile getTile(int x, int y) {
        return tileArray[x][y];
    }
}
