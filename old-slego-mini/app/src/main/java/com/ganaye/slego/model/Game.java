package com.ganaye.slego.model;

import android.graphics.Point;
import android.graphics.PointF;
import android.graphics.Rect;

import com.ganaye.core.MutableValue;
import com.ganaye.core.Observable;
import com.ganaye.slego.ui.game.GameScreenLayout;

import java.util.ArrayList;

import static com.ganaye.slego.ui.game.GameScreenLayout.TILE_SIZE;
import static com.ganaye.slego.ui.game.PlayAnimations.points;

public class Game {
    public final long seed;
    public final ArrayList<Piece> pieces = new ArrayList<>();
    public boolean isDraggingHand;
    public Rect antsRectangle;
    private final MutableValue<String> _message = new MutableValue(this, "");
    private final MutableValue<GameUIState> _gameState = new MutableValue(this, GameUIState.showingNextPiece);
    public final BoardTile[] boardTiles = new BoardTile[25];
    public final Observable<String> message = _message.getObservable();
    public final Observable<GameUIState> gameState = _gameState.getObservable();

    public final PointF handPos = new PointF();
    public final Rect handHome = new Rect();
    public final Rect boardRect = new Rect();
    public final int roundCount;
    private int currentScore = 0;
    public GameScreenLayout gameLayout;
    public float pixelSize;
    public int pxWidth;
    public int pxHeight;
    private int currentRoundNumber;
    ArrayList<RoundResult> roundResults = new ArrayList<>();

    public static int getTileNo(int x, int y) {
        return y * 5 + x;
    }

    public Game(long seed, int roundCount) {
        for (int i = 0; i < 25; i++) {
            boardTiles[i] = new BoardTile(i);
        }
        this.seed = seed;
        this.roundCount = roundCount;
        PieceBuilder pieceBuilder = new PieceBuilder(seed);
        pieces.clear();
        for (int i = 0; i < roundCount; i++) {
            pieces.add(pieceBuilder.nextRandomPiece());
        }
    }

    public Piece getPiece(int i) {
        return i >= 0 && i < pieces.size() ? pieces.get(i) : null;
    }

    public void play(int handX, int handY) {
        Piece piece = getCurrentPiece();
        if (piece != null) {
            RoundResult roundResult = new RoundResult(boardTiles, roundResults.size(), piece, handX, handY, this.currentScore);
            if (currentRoundNumber < roundResults.size()) {
                roundResults.set(currentRoundNumber, roundResult);
            } else {
                roundResults.add(roundResult);
            }
            setGameState(GameUIState.showingScore);
        }
    }

    public BoardTile getBoardTile(int i) {
        return boardTiles[i];
    }

    public Piece getCurrentPiece() {
        return getPiece(currentRoundNumber);
    }

    public Point getTileCenter(int x, int y) {
        return new Point(
                Math.round(boardRect.left + TILE_SIZE / 2 + TILE_SIZE * x),
                Math.round(boardRect.top + TILE_SIZE / 2 + TILE_SIZE * y));
    }

    public void setGameState(GameUIState newState) {
        if (_gameState.getValue() == newState) return;
        // Log.d(TAG, "GameState: " + newState);
        _gameState.setValue(newState);
    }

    private static String TAG = "Game";

    public boolean isFinished() {
        return this.roundResults.size() >= this.roundCount;
    }

    public void onUndoRoundClicked() {
        RoundResult currentRoundResult = getRoundResult();
        for (int i = 0; i < 25; i++) {
            TileImage previousTileImage =
                    (currentRoundResult == null)
                            ? TileImage.Empty
                            : currentRoundResult.getOriginalTileImage(i);
            BoardTile boardTile = getBoardTile(i);
            boardTile.setTileImage(previousTileImage);
        }
        setGameState(GameUIState.waitingForPlayerToPlay);
    }

    public void onNextRoundClicked() {
        currentRoundNumber += 1;
        if (currentRoundNumber < roundCount) {
            RoundResult roundResult = roundResults.get(currentRoundNumber - 1);
            currentScore = roundResult.newScore;
            for (int i = 0; i < 25; i++) {
                TileImage newTileImage = roundResult.getNewTileImage(i);
                BoardTile boardTile = getBoardTile(i);
                boardTile.setTileImage(newTileImage);
            }
            _message.setValue(points(currentScore));
            _gameState.setValue(GameUIState.showingNextPiece);
        }
    }

    public RoundResult getRoundResult() {
        return (currentRoundNumber < roundResults.size()) ? roundResults.get(currentRoundNumber) : null;
    }

    public int getCurrentRoundNumber() {
        return currentRoundNumber;
    }
}
