package com.ganaye.slego.ui.game;

import android.animation.Animator;
import android.animation.AnimatorListenerAdapter;
import android.animation.AnimatorSet;
import android.animation.ObjectAnimator;
import android.util.Log;
import android.view.View;
import android.view.animation.AnticipateInterpolator;
import android.view.animation.Interpolator;

import com.ganaye.slego.R;
import com.ganaye.slego.model.BoardTile;
import com.ganaye.slego.model.Game;
import com.ganaye.slego.model.GameUIState;
import com.ganaye.slego.model.Piece;
import com.ganaye.slego.model.RoundResult;
import com.ganaye.slego.ui.AntsView;
import com.ganaye.slego.ui.BoardView;
import com.ganaye.slego.ui.DeckView;
import com.ganaye.slego.ui.HandView;
import com.ganaye.slego.ui.PieceView;
import com.ganaye.slego.ui.ScoreView;
import com.ganaye.slego.ui.TileView;

import java.util.ArrayList;
import java.util.Random;

import static android.view.View.VISIBLE;
import static com.ganaye.slego.SlegoApp.ANIMATION_MULTIPLIER;
import static com.ganaye.slego.ui.game.FloatingTexts.MOVING_TEXT_DELAY;
import static com.ganaye.slego.ui.game.GameScreenLayout.DECK_TILE_SIZE;
import static com.ganaye.slego.ui.game.GameScreenLayout.HAND_HEIGHT;
import static com.ganaye.slego.ui.game.GameScreenLayout.HAND_WIDTH;
import static com.ganaye.slego.ui.game.GameScreenLayout.TILE_SIZE;

public class PlayAnimations {
    private static final String TAG = "PlayAnimations";
    private final ScoreView scoreView;
    int ANIMATE_HAND_DURATION = 30 * ANIMATION_MULTIPLIER;
    int DELAY_BETWEEN_REPLACED_TILES = 10 * ANIMATION_MULTIPLIER;
    int TILE_AWAY_DURATION = 150 * ANIMATION_MULTIPLIER;
    int DELAY_BETWEEN_LINE_TILES = 1 * ANIMATION_MULTIPLIER;
    int SCORE_COIN_ANIMATION_DURATION = 10 * ANIMATION_MULTIPLIER;
    int TILE_AWAY_ALPHA_ZERO_DURATION = 0 * ANIMATION_MULTIPLIER;
    int SHOW_DECK_DURATION = 50 * ANIMATION_MULTIPLIER;
    int PIECE_REVEAL_DURATION = 100 * ANIMATION_MULTIPLIER;
    int HIDE_DECK_DELAY = 50 * ANIMATION_MULTIPLIER;
    int HIDE_DECK_DURATION = 50 * ANIMATION_MULTIPLIER;

    private final DeckView deckView;
    private final AntsView antsView;
    private final HandView handView;
    private final FloatingTexts floatingTexts;
    private final GameScreen gameScreen;
    private final Game game;
    private final BoardView board;
    Interpolator handInterpolator = new AnticipateInterpolator();
    Random rnd = new Random();
    private int runningScore;
    private int displayedScore;

    public PlayAnimations(GameScreen gameScreen, Game game) {
        this.gameScreen = gameScreen;
        this.game = game;
        this.deckView = gameScreen.deckView;
        this.board = gameScreen.board;
        this.handView = gameScreen.handView;
        this.antsView = gameScreen.antsView;
        this.floatingTexts = gameScreen.floatingTexts;
        this.scoreView = gameScreen.scoreView;
    }

    public void showingNextPiece(Runnable followedBy) {
        floatingTexts.clear();
        animateDeck(() -> {
            // game.setGameState(GameUIState.waitingForPlayerToPlay);
            game.setGameState(GameUIState.waitingForPlayerToPlay);
            if (followedBy != null) followedBy.run();
        });
    }

    public void showingScore(RoundResult roundResult, Runnable followedBy) {
        Log.d(TAG, "start");
        this.displayedScore = roundResult.originalScore;
        this.runningScore = this.displayedScore;
        showRoundResult(() ->
                animateHandPressed(roundResult,
                        () -> animateLine(roundResult, 0, () -> {
                            // we wait for the user to confirm here.
                            gameScreen.undoButton.setVisibility(VISIBLE);
                            gameScreen.nextRoundButton.setVisibility(VISIBLE);
                            game.setGameState(GameUIState.waitingForPlayerToCompleteRound);
                            if (followedBy != null) followedBy.run();
                        })));
    }

    enum TileAwayMode {
        up,
        down,
        fade
    }

    private void animateTileAway(ArrayList<Animator> animators, int startDelay, TileView tileView, TileAwayMode tileAwayMode) {
        if (tileAwayMode == TileAwayMode.fade) {
            final Animator midAlpha = ObjectAnimator
                    .ofFloat(tileView, View.ALPHA, 1f, 0.5f)
                    .setDuration(TILE_AWAY_DURATION);
            animators.add(midAlpha);
        } else {
            final Animator rotX;
            {
                rotX = ObjectAnimator
                        .ofFloat(tileView, View.ROTATION_X, 0f, rnd.nextInt(1800))
                        .setDuration(TILE_AWAY_DURATION);
                rotX.setStartDelay(startDelay);
                animators.add(rotX);
            }
            {
                final Animator rotY = ObjectAnimator
                        .ofFloat(tileView, View.ROTATION_Y, 0f, rnd.nextInt(360) - 180)
                        .setDuration(TILE_AWAY_DURATION);
                rotY.setStartDelay(startDelay);
                animators.add(rotY);
            }
            {
                final Animator transY = ObjectAnimator
                        .ofFloat(tileView, View.TRANSLATION_Y, 0f, (tileAwayMode == TileAwayMode.down ? 1f : -1f) * gameScreen.getHeight())
                        .setDuration(TILE_AWAY_DURATION);
                transY.setStartDelay(startDelay);
                animators.add(transY);
            }
            {
                final Animator scaleX = ObjectAnimator
                        .ofFloat(tileView, View.SCALE_X, 1f, 4f)
                        .setDuration(TILE_AWAY_DURATION);
                scaleX.setStartDelay(startDelay);
                animators.add(scaleX);
            }
            {
                final Animator scaleY = ObjectAnimator
                        .ofFloat(tileView, View.SCALE_Y, 1f, 4f)
                        .setDuration(TILE_AWAY_DURATION);
                scaleY.setStartDelay(startDelay);
                animators.add(scaleY);
            }
            {
                final Animator alphaZero = ObjectAnimator
                        .ofFloat(tileView, View.ALPHA, 1f, 0f)
                        .setDuration(TILE_AWAY_ALPHA_ZERO_DURATION);
                alphaZero.setStartDelay(TILE_AWAY_DURATION - TILE_AWAY_ALPHA_ZERO_DURATION);
                animators.add(alphaZero);
            }
            if (tileAwayMode == TileAwayMode.down) {
                rotX.addListener(new AnimatorListenerAdapter() {
                    @Override
                    public void onAnimationStart(Animator animation) {
                        gameScreen.postDelayed(() -> SoundEffects.play(R.raw.sfx_exp_shortest_soft2), startDelay);
                    }
                });
            }
        }
    }

    static String addS(String unit, boolean addS) {
        return addS ? unit + "s" : unit;
    }

    static String plural(int count, String unit) {
        return Integer.toString(count) + " " + addS(unit, Math.abs(count) > 1);
    }

    public static String points(int points) {
        return plural(points, "point");
    }

    private void animateHandPressed(RoundResult roundResult, Runnable followedBy) {
        AnimatorSet tileAwaySubset = new AnimatorSet();
        ArrayList<Animator> animators = new ArrayList();

        animateReplacedTiles(roundResult, animators);

        ArrayList<RoundResult.HandTile> replacedTiles = roundResult.replacedTiles;
        if (replacedTiles.size() > 0) {
            int x = replacedTiles.get(0).x;
            int y = replacedTiles.get(0).y;
            showBoardText(x, y, addS("Replaced tile", replacedTiles.size() > 1)
                    + " " + points(-replacedTiles.size()), () -> {
                runningScore -= replacedTiles.size();
                animateScore(null);
            });
        }

        final Animator scaleX = ObjectAnimator
                .ofFloat(handView, View.SCALE_X, handView.getScaleX(), 1f)
                .setDuration(ANIMATE_HAND_DURATION);
        scaleX.setInterpolator(handInterpolator);
        animators.add(scaleX);
        final Animator scaleY = ObjectAnimator
                .ofFloat(handView, View.SCALE_Y, handView.getScaleY(), 1f)
                .setDuration(ANIMATE_HAND_DURATION);
        scaleY.setInterpolator(handInterpolator);
        animators.add(scaleY);


        ArrayList<RoundResult.HandTile> handTiles = roundResult.handTiles;
        for (
                int i = 0; i < handTiles.size(); i++) {
            RoundResult.HandTile handTile = handTiles.get(i);
            if (!handTile.isInBoard) {
                TileView tileView = handView.getTileView(handTile.hx, handTile.hy);
                final Animator alpha0 = ObjectAnimator
                        .ofFloat(tileView, View.ALPHA, 1f, 0f)
                        .setDuration(ANIMATE_HAND_DURATION);
                animators.add(alpha0);
            }
        }

        tileAwaySubset.playTogether(animators);
        tileAwaySubset.start();

        tileAwaySubset.addListener(new XAnimatorListenerAdapter("tileAwaySubset") {
            @Override
            public void onAnimationEnd(Animator animation) {
                for (int i = 0; i < handTiles.size(); i++) {
                    RoundResult.HandTile handTile = handTiles.get(i);
                    if (handTile.isInBoard) {
                        TileView tileView = board.getTileView(handTile.x, handTile.y);
                        resetView(tileView);
                        tileView.setTileImage(handTile.newShape);
                    } else {
                        TileView tileView = handView.getTileView(handTile.hx, handTile.hy);
                        resetView(tileView);
                    }
                }
                handView.setVisibility(View.INVISIBLE);
                if (followedBy != null) followedBy.run();
            }
        });
    }


    void showBoardText(int x, int y, String text,
                       Runnable followedBy) {
        if (x > 2) x = 2;
        int x1 = game.boardRect.left + x * TILE_SIZE;
        int y1 = game.boardRect.top + y * TILE_SIZE;
        floatingTexts.newFrom(x1, y1, text, followedBy, MOVING_TEXT_DELAY);
    }


    void addScoreText(String text, Runnable followedBy) {
        floatingTexts.addNew(text, followedBy, 0);
    }


    public static void resetView(View v) {
        v.setRotation(0f);
        v.setRotationX(0f);
        v.setRotationY(0f);
        v.setScaleX(1f);
        v.setScaleY(1f);
        v.setTranslationX(0f);
        v.setTranslationY(0f);
        v.setAlpha(1f);
        v.setVisibility(VISIBLE);
    }

    private int animateReplacedTiles(RoundResult roundResult, ArrayList<Animator> globalAnimators) {
        ArrayList<RoundResult.HandTile> replacedTiles = roundResult.replacedTiles;
        if (replacedTiles.size() > 0) {
            AnimatorSet replacedTilesSubset = new AnimatorSet();
            ArrayList<Animator> subsetAnimators = new ArrayList();
            for (int i = 0; i < replacedTiles.size(); i++) {
                RoundResult.HandTile replacedTile = replacedTiles.get(i);
                final TileView tileView = board.getTileView(replacedTile.boardTile);
                animateTileAway(subsetAnimators, i * DELAY_BETWEEN_REPLACED_TILES, tileView, TileAwayMode.down);
            }
            replacedTilesSubset.playTogether(subsetAnimators);
            replacedTilesSubset.addListener(new XAnimatorListenerAdapter("replacedTilesSubset"));
            globalAnimators.add(replacedTilesSubset);
        }
        return DELAY_BETWEEN_REPLACED_TILES * (replacedTiles.size() - 1) + TILE_AWAY_DURATION;
    }

    private void animateLine(RoundResult roundResult, final int lineNo, Runnable followedBy) {
        ArrayList<RoundResult.Line> lines = roundResult.lines;
        if (lineNo < lines.size()) {
            RoundResult.Line line = lines.get(lineNo);
            AnimatorSet lineSubSet = new AnimatorSet();
            ArrayList<Animator> removedTiles = new ArrayList<>();
            antsView.showLine(line);
            showBoardText(line.x, line.y, line.text, () -> antsView.showLine(null));

            for (int j = 0; j < line.tiles.size(); j++) {
                RoundResult.LineTile lineTile = line.tiles.get(j);
                BoardTile boardTile = lineTile.boardTile;
                TileView tileView = board.getTileView(boardTile.x, boardTile.y);
                lineTile.lineCount--;
                animateTileAway(removedTiles, j * DELAY_BETWEEN_LINE_TILES, tileView, lineTile.lineCount <= 0 ? TileAwayMode.up : TileAwayMode.fade);
            }
            lineSubSet.playTogether(removedTiles);
            lineSubSet.addListener(new XAnimatorListenerAdapter("lineSubSet") {
                @Override
                public void onAnimationStart(Animator animation) {
                    SoundEffects.play(R.raw.sfx_exp_shortest_soft2);
                    runningScore += line.points;
                    animateScore(null);
                }

                @Override
                public void onAnimationEnd(Animator animation) {
                    animateLine(roundResult, lineNo + 1, followedBy);
                }

            });
            lineSubSet.start();
        } else {
            Runnable finalLine = () -> {
                String totalString;
                if (roundResult.hasComplexTotal) {
                    totalString = "Total " + points(roundResult.total);
                } else {
                    totalString = "Round complete";
                }
                runningScore = roundResult.newScore;
                animateScore(null);
                addScoreText(totalString, followedBy);

            };
            if (roundResult.nbLines > 1) {
                String multiplierString = roundResult.nbLines + " lines bonus " + points(roundResult.linesBonus);
                addScoreText(multiplierString, () -> {
                    runningScore += roundResult.linesBonus;
                    animateScore(finalLine);
                });
            } else {
                finalLine.run();
            }
        }
    }

    private void animateScore(Runnable followedBy) {
        if (displayedScore == runningScore) {
            scoreView.setAlpha(1f);
            scoreView.setTranslationY(0f);
            if (followedBy != null) followedBy.run();
        } else {
            int increment = runningScore - displayedScore;
            if (increment > 10) increment = 10;
            else if (increment < -10) increment = -10;
            if (increment > 0) {
                SoundEffects.play(R.raw.sfx_coin_double2);
            }
            displayedScore += increment;
            this.scoreView.setText(points(displayedScore));
            AnimatorSet animateDeck = new AnimatorSet();
            Animator a1 = ObjectAnimator.ofFloat(scoreView, View.TRANSLATION_Y, 0f, -20f);
            Animator a2 = ObjectAnimator.ofFloat(scoreView, View.ALPHA, 1f, 0f);
            a1.setDuration(SCORE_COIN_ANIMATION_DURATION);
            a2.setDuration(SCORE_COIN_ANIMATION_DURATION);
            animateDeck.playTogether(a1, a2);

            animateDeck.addListener(new AnimatorListenerAdapter() {
                @Override
                public void onAnimationEnd(Animator animation) {
                    animateScore(followedBy);
                }
            });
            animateDeck.start();
        }
    }

    void showRoundResult(Runnable followedBy) {
        int roundNo = game.getCurrentRoundNumber();
        String text;
        text = "Round " + (roundNo + 1) + "/" + game.roundCount;
        floatingTexts.addNew(text, followedBy, 0);
    }

    private void animateDeck(Runnable followedBy) {
        AnimatorSet animateDeck = new AnimatorSet();
        ArrayList<Animator> animateDeckAnimators = new ArrayList();
        // show deck
        {
            int pieceNo = game.getCurrentRoundNumber();
            deckView.setVisibility(VISIBLE);
            deckView.setPivotX(0);
            deckView.setPivotY(0);
            for (int i = 0; i < pieceNo; i++) {
                PieceView p = deckView.getPieceView(i);
                if (p != null) {
                    p.reveal();
                    resetView(p);
                }
            }
            //   deckView.setVisibility(VISIBLE);
            final Animator showDeck = ObjectAnimator
//                    .ofFloat(deckView, View.TRANSLATION_Y, gameScreen.getHeight(), 0f)
                    .ofFloat(deckView, View.TRANSLATION_X, gameScreen.getWidth(), 0f)
                    .setDuration(SHOW_DECK_DURATION);
            showDeck.addListener(new AnimatorListenerAdapter() {
                @Override
                public void onAnimationEnd(Animator animation) {
                    //floatingTextView.setVisibility(View.INVISIBLE);
                    revealPiece(pieceNo, followedBy);
                }

            });
            animateDeckAnimators.add(showDeck);
        }

        // hide deck;
        {
            final Animator hideDeck = ObjectAnimator
                    .ofFloat(deckView, View.TRANSLATION_X, 0f, gameScreen.getWidth())
//                    .ofFloat(deckView, View.TRANSLATION_Y, 0f, gameScreen.getHeight())
                    .setDuration(HIDE_DECK_DURATION);
            hideDeck.setStartDelay(HIDE_DECK_DELAY);
            animateDeckAnimators.add(hideDeck);
        }
        animateDeck.playSequentially(animateDeckAnimators);
        animateDeck.start();
    }

    private void revealPiece(int pieceNo, Runnable followedBy) {
        PieceView v = deckView.getPieceView(pieceNo);

        PieceView original = deckView.getPieceView(pieceNo);
        if (original == null) {
            if (followedBy != null) followedBy.run();

        } else {
            original.setVisibility(View.INVISIBLE);
            Piece piece = game.getPiece(pieceNo);
            handView.layout(-HAND_WIDTH / 2, -HAND_HEIGHT / 2, HAND_WIDTH / 2, HAND_HEIGHT / 2);
            handView.setVisibility(VISIBLE);
            handView.setPiece(piece, false);
//                        handView.setPivotX(HAND_WIDTH / 2); // handView.getWidth() / 2);
//                        handView.setPivotY(HAND_WIDTH / 2); // handView.getHeight() / 2);
            Log.d(TAG, "px:" + handView.getPivotX() + " py:" + handView.getPivotY());

            float s1 = ((float) DECK_TILE_SIZE) / TILE_SIZE;
            float s2 = 1f;
            // I found this following formula empirically and it makes no sense to me.
            float x1 = (v.getLeft() + v.getRight()) / 2; // (v.getLeft() + v.getRight()) / 2;
            float y1 = (v.getTop() + v.getBottom()) / 2; // (v.getTop() + v.getRight()) / 2;

            float x2 = game.handHome.centerX(); // (game.handHome.left + game.handHome.right) / 2;
            float y2 = game.handHome.centerY(); // (game.handHome.top + game.handHome.bottom) / 2;

            Log.d(TAG, "x1:" + x1 + " y1:" + y1 + " x2:" + x2 + " y2:" + y2);
            AnimatorSet moveDeckPieceToHome = new AnimatorSet();
            ObjectAnimator x = ObjectAnimator.ofFloat(handView, View.TRANSLATION_X, x1, x2).setDuration(PIECE_REVEAL_DURATION);
            ObjectAnimator y = ObjectAnimator.ofFloat(handView, View.TRANSLATION_Y, y1, y2).setDuration(PIECE_REVEAL_DURATION);
            ObjectAnimator sx = ObjectAnimator.ofFloat(handView, View.SCALE_X, s1, s2).setDuration(PIECE_REVEAL_DURATION);
            ObjectAnimator sy = ObjectAnimator.ofFloat(handView, View.SCALE_Y, s1, s2).setDuration(PIECE_REVEAL_DURATION);
            ObjectAnimator r = ObjectAnimator.ofFloat(handView, View.ROTATION, 180, 0).setDuration(PIECE_REVEAL_DURATION);
            ObjectAnimator rx1 = ObjectAnimator.ofFloat(handView, View.ROTATION_X, 180, 90).setDuration(PIECE_REVEAL_DURATION / 2);
            ObjectAnimator rx2 = ObjectAnimator.ofFloat(handView, View.ROTATION_X, 90, 0).setDuration(PIECE_REVEAL_DURATION / 2);
            AnimatorSet rx = new AnimatorSet();
            rx.playSequentially(rx1, rx2);
            rx1.addListener(new AnimatorListenerAdapter() {
                @Override
                public void onAnimationEnd(Animator animation) {
                    handView.setPiece(piece, true);
                }
            });
            moveDeckPieceToHome.playTogether(x, y, sx, sy, rx, r);
            moveDeckPieceToHome.start();

            moveDeckPieceToHome.addListener(new AnimatorListenerAdapter() {
                @Override
                public void onAnimationEnd(Animator animation) {
                    // handView.setVisibility(View.INVISIBLE);
                    resetView(handView);
                    handView.moveToHome();
                    SoundEffects.play(R.raw.sfx_sounds_impact3);
                    if (followedBy != null) followedBy.run();
                }
            });
        }
    }
}