package com.ganaye.slego.ui.game;

import android.annotation.SuppressLint;
import android.content.Context;
import android.graphics.Color;
import android.graphics.Point;
import android.graphics.PointF;
import android.util.Log;
import android.view.KeyEvent;
import android.view.MotionEvent;
import android.view.View;

import com.ganaye.slego.NavigateAnimation;
import com.ganaye.slego.NavigateScreen;
import com.ganaye.slego.R;
import com.ganaye.slego.SlegoApp;
import com.ganaye.slego.model.Game;
import com.ganaye.slego.model.GameUIState;
import com.ganaye.slego.ui.AntsView;
import com.ganaye.slego.ui.BackButton;
import com.ganaye.slego.ui.BackgroundEffect;
import com.ganaye.slego.ui.BoardView;
import com.ganaye.slego.ui.DeckView;
import com.ganaye.slego.ui.HandView;
import com.ganaye.slego.ui.IScreen;
import com.ganaye.slego.ui.LogoView;
import com.ganaye.slego.ui.PixelatedButton;
import com.ganaye.slego.ui.PixelatedTextView;
import com.ganaye.slego.ui.PixelatedViewGroup;
import com.ganaye.slego.ui.RoundButton;
import com.ganaye.slego.ui.ScoreView;
import com.ganaye.slego.ui.effects.StarFieldEffect;

import static android.view.KeyEvent.ACTION_DOWN;
import static android.view.KeyEvent.ACTION_UP;
import static android.view.KeyEvent.KEYCODE_DPAD_DOWN;
import static android.view.KeyEvent.KEYCODE_DPAD_LEFT;
import static android.view.KeyEvent.KEYCODE_DPAD_RIGHT;
import static android.view.KeyEvent.KEYCODE_DPAD_UP;
import static android.view.KeyEvent.KEYCODE_ENTER;
import static com.ganaye.slego.ui.game.GameScreenLayout.TILE_SIZE;
import static com.ganaye.slego.ui.game.PlayAnimations.points;

public class GameScreen extends PixelatedViewGroup implements IScreen {
    public final int BUTTON_MARGIN = 3;
    final BoardView board;
    final HandView handView;
    final ScoreView scoreView;
    final BackButton backButton;
    final PixelatedButton optionsButton;
    final LogoView logo;
    final FloatingTexts floatingTexts;
    final AntsView antsView;
    private final Game game;
    final DeckView deckView;
    private final SlegoApp app;
    final PixelatedButton undoButton;
    final PixelatedButton nextRoundButton;
    public PixelatedTextView debugTextView;
    String TAG = "GameScreen";
    int handX = -1, handY = 4;
    final PlayAnimations playAnimations;

    public GameScreen(Context context, Game game) {
        super(context, Color.DKGRAY);
        this.app = SlegoApp.getInstance();
        this.game = game;

        addView(this.logo = new LogoView(context, 1f));

        addView(this.scoreView = new ScoreView(context, game));
        // addView(this.banner = new BannerView(context, ));
        addView(this.optionsButton = new RoundButton(context, "⋮"));
        addView(this.backButton = new BackButton(context));

        addView(this.board = new BoardView(context, game));
        addView(undoButton = new PixelatedButton(getContext(), "Undo"));
        addView(nextRoundButton = new PixelatedButton(getContext(), "Next round"));
        nextRoundButton.upDrawableId = R.drawable.button_up_default;
        addView(this.deckView = new DeckView(context, game));
        addView(this.antsView = new AntsView(context, game));
        addView(this.handView = new HandView(context, game));
        addView(this.floatingTexts = new FloatingTexts(context, this, game));
        if (SlegoApp.DEBUG) addView(this.debugTextView = new PixelatedTextView(context));

        optionsButton.setOnClickListener((v) -> app.navigateTo(
                NavigateScreen.Options, NavigateAnimation.enterFromRight));

        undoButton.setOnClickListener(v -> {
            undoButton.setVisibility(INVISIBLE);
            nextRoundButton.setVisibility(INVISIBLE);
            handView.moveToHome();
            floatingTexts.clear();
            this.scoreView.setText(points(game.getRoundResult().originalScore));
            game.onUndoRoundClicked();
        });

        nextRoundButton.setOnClickListener(v -> {
            undoButton.setVisibility(INVISIBLE);
            nextRoundButton.setVisibility(INVISIBLE);
            game.onNextRoundClicked();
        });
        playAnimations = new PlayAnimations(this, game);
        game.gameState.addObserverAndRun(this, this::onGameStateChanged);
    }


    @Override
    public BackgroundEffect getBackgroundEffect() {
        return new StarFieldEffect(getContext()); //
        //return new BlueScreenEffect(getContext()); // BannerEffect(getContext());
    }

    @SuppressLint("ClickableViewAccessibility")
    @Override
    public boolean onTouchEvent(MotionEvent event) {
        float x = event.getX();
        float y = event.getY();
        final GameUIState gameUIState = this.game.gameState.getValue();

        switch (event.getAction()) {
            case MotionEvent.ACTION_DOWN:
                //this.setPressed(true);
                if (gameUIState == GameUIState.waitingForPlayerToPlay) {
                    game.isDraggingHand = true;
                    antsView.invalidate();
                    scaleHand(true);
                    return true;
                }
            case MotionEvent.ACTION_CANCEL:
                if (game.isDraggingHand) {
                    game.isDraggingHand = false;
                }
                break;
            case MotionEvent.ACTION_MOVE:
                // Log.d(TAG, "ACTION_MOVE " + event.getX() + " " + event.getY());
                if (game.isDraggingHand) {
                    int nx = Math.round(x - app.fingerOffsetX * handView.getWidth());
                    int ny = Math.round(y - app.fingerOffsetY * handView.getHeight());
                    Log.d(TAG, "nx:" + Math.round(x - app.fingerOffsetX * handView.getWidth()) + " ny:" + Math.round(y - app.fingerOffsetY * handView.getHeight()));
                    handView.layout(nx, ny, nx + handView.getWidth(), ny + handView.getHeight());
                    moveHand();
                }
                return true;
            case MotionEvent.ACTION_UP:
                Log.d(TAG, "ACTION_UP " + x + " " + y);
                if (game.isDraggingHand) {
                    game.isDraggingHand = false;
                    // scaleHand(false);
                    moveHand();
                    int tx = Math.round(game.handPos.x);
                    int ty = Math.round(game.handPos.y);

                    if (tx >= 0 && tx <= 4 && ty >= 0 && ty <= 4) {
                        PointF nearestTile = new PointF(tx, ty);
                        setHandPos(nearestTile);
                        game.play(tx, ty);
                    }
                }
                break;
        }
        return super.onTouchEvent(event);
    }

    void scaleHand(boolean isDragging) {
        float scale = isDragging ? 1.1f : 1.0f;
        handView.setScaleX(scale);
        handView.setScaleY(scale);
    }

    @Override
    protected void onLayout(boolean changed, int left, int top, int right, int bottom) {
        game.gameLayout.applyLayout(this, game.pxWidth, game.pxHeight);
        deckView.layout(left, top, right, bottom);
        antsView.layout(left, top, right, bottom);
        board.layout(left, top, right, bottom);
        if (debugTextView != null) debugTextView.layout(left, top, right, top + 40);
        storeLayout();

        GameUIState gameStateValue = game.gameState.getValue();
        deckView.setVisibility(INVISIBLE);
        handView.setVisibility(gameStateValue == GameUIState.waitingForPlayerToPlay ? VISIBLE : INVISIBLE);

        undoButton.measure(
                MeasureSpec.makeMeasureSpec(right - left, MeasureSpec.AT_MOST),
                MeasureSpec.makeMeasureSpec(bottom - top, MeasureSpec.AT_MOST));
        int undoBtnWidth = undoButton.getMeasuredWidth();
        int undoBtnHeight = undoButton.getMeasuredHeight();

        nextRoundButton.measure(
                MeasureSpec.makeMeasureSpec(right - left, MeasureSpec.AT_MOST),
                MeasureSpec.makeMeasureSpec(bottom - top, MeasureSpec.AT_MOST));
        int nextBtnWidth = nextRoundButton.getMeasuredWidth();
        int nextBtnHeight = nextRoundButton.getMeasuredHeight();

        undoButton.layout(left + BUTTON_MARGIN, bottom - undoBtnHeight - BUTTON_MARGIN, left + BUTTON_MARGIN + undoBtnWidth, bottom - BUTTON_MARGIN);
        nextRoundButton.layout(right - BUTTON_MARGIN - nextBtnWidth, bottom - nextBtnHeight - BUTTON_MARGIN, right - BUTTON_MARGIN, bottom - BUTTON_MARGIN);

        undoButton.setVisibility(gameStateValue == GameUIState.waitingForPlayerToCompleteRound ? VISIBLE : INVISIBLE);
        nextRoundButton.setVisibility(gameStateValue == GameUIState.waitingForPlayerToCompleteRound ? VISIBLE : INVISIBLE);

    }

    private void storeLayout() {
        game.handHome.set(handView.getLeft(), handView.getTop(), handView.getRight(), handView.getBottom());
    }

    @Override
    public View getView() {
        return this;
    }

    @Override
    public void onMainActivityPaused() {

    }

    @Override
    public void onMainActivityResumed() {
        //onGameStateChanged();
    }

    public void onGameStateChanged() {
//        Log.d(TAG, "onGameStateChanged: " + game.gameState.getValue());
        GameUIState gameStateValue = game.gameState.getValue();
//        if (debugTextView != null) debugTextView.setText(gameStateValue.name());
        switch (gameStateValue) {
            case showingScore:
                playAnimations.showingScore(game.getRoundResult(), () -> {
                    // animation complete
                });
                break;
            case showingNextPiece:
                playAnimations.showingNextPiece(() -> {
                    // animation complete
                });
                break;
        }
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        //if (app.onKeyDown(keyCode, event)) return true;
        //else
        return super.onKeyDown(keyCode, event);
    }

    @Override
    public boolean onKeyUp(int keyCode, KeyEvent event) {
        //if (!app.onKeyUp(keyCode, event)) return true;
        //else
        return super.onKeyDown(keyCode, event);
    }

    @Override
    public boolean dispatchKeyEvent(KeyEvent event) {
        //return super.dispatchKeyEvent(event);
        switch (event.getAction()) {
            case ACTION_DOWN:
                return onKeyDown(event.getKeyCode());
            case ACTION_UP:
                break;
        }
        return false;
    }


    public boolean onKeyDown(int keyCode) {
        switch (keyCode) {
            case KEYCODE_ENTER:
                if (handX >= 0) {
                    app.getCurrentGame().play(handX, handY);
                }
                return true;
            case KEYCODE_DPAD_RIGHT:
                if (handX < 4) {
                    handX += 1;
                    moveHandToFocus();
                }
                return true;
            case KEYCODE_DPAD_LEFT:
                if (handX < 0) {
                    handX = 4;
                    moveHandToFocus();
                } else if (handX > 0) {
                    handX -= 1;
                    moveHandToFocus();
                }
                return true;
            case KEYCODE_DPAD_UP:
                if (handY > 0) {
                    if (handX < 0) handX = 0;
                    handY -= 1;
                    moveHandToFocus();
                }
                return true;
            case KEYCODE_DPAD_DOWN:
                if (handY < 4) {
                    if (handX < 0) handX = 0;
                    handY += 1;
                    moveHandToFocus();
                }
                return true;
        }
        return false;
    }

    private void moveHandToFocus() {
        if (handX < 0) handView.moveToHome();
        else setHandPos(new PointF(handX, handY));
    }

    private void moveHand() {
        Point handCenter = handView.getCenter();
        Point tileCenter = game.getTileCenter(0, 0);
        float dx = (handCenter.x - tileCenter.x) / (float) TILE_SIZE;
        float dy = (handCenter.y - tileCenter.y) / (float) TILE_SIZE;
        Log.d(TAG, "Moved x:" + dx + " y:" + dy);
        game.handPos.set(dx, dy);
    }

    private void setHandPos(PointF pt) {
        Log.d(TAG, "movehand x:" + pt.x + " y: " + pt.y);
        Point tileZero = game.getTileCenter(0, 0);
        Point handCenter = handView.getCenter();
        float newX = tileZero.x + TILE_SIZE * pt.x;
        float newY = tileZero.y + TILE_SIZE * pt.y;
        int left = Math.round(handView.getLeft() + newX - handCenter.x);
        int top = Math.round(handView.getTop() + newY - handCenter.y);
        handView.layout(left, top, left + handView.getWidth(), top + handView.getHeight());
    }

}
