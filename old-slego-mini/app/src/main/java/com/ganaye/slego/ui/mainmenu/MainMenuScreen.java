package com.ganaye.slego.ui.mainmenu;

import android.app.Activity;
import android.content.Context;
import android.util.Log;
import android.view.View;

import com.ganaye.slego.NavigateAnimation;
import com.ganaye.slego.NavigateScreen;
import com.ganaye.slego.R;
import com.ganaye.slego.SlegoApp;
import com.ganaye.slego.model.Game;
import com.ganaye.slego.model.PieceBuilder;
import com.ganaye.slego.ui.BackgroundEffect;
import com.ganaye.slego.ui.IScreen;
import com.ganaye.slego.ui.ScrollLayout;
import com.ganaye.slego.ui.effects.StarFieldEffect;


public class MainMenuScreen extends ScrollLayout implements IScreen {
    final static String TAG = "MainMenuScreen";
    SlegoApp app = SlegoApp.getInstance();
    Game game = app.getCurrentGame();

    public MainMenuScreen(Context context) {
        super(context);
        addLogo();
        addText(getContext().getString(R.string.welcome));
        addButton(getContext().getString(R.string.play), (v) -> {
            if (game.isFinished()) {
                app.createNewGame();
                PieceBuilder pieceBuilder = new PieceBuilder(0);
                game.pieces.clear();
                for (int i = 0; i < 0; i++) {
                    game.pieces.add(pieceBuilder.nextRandomPiece());
                }
            }
            SlegoApp.getInstance().navigateTo(NavigateScreen.Game, NavigateAnimation.enterFromRight);
        });
        addButton(getContext().getString(R.string.about), (v) ->
                SlegoApp.getInstance().navigateTo(
                        NavigateScreen.About,
                        NavigateAnimation.enterFromRight));
        addButton(getContext().getString(R.string.quit), (v) -> ((Activity) this.getContext()).finish());
    }


    @Override
    protected void onSizeChanged(int w, int h, int oldw, int oldh) {
        super.onSizeChanged(w, h, oldw, oldh);
        Log.d(TAG, "size changed w:" + w + " h:" + h);
    }

    @Override
    public BackgroundEffect getBackgroundEffect() {
        return new StarFieldEffect(getContext());
    }

    @Override
    public View getView() {
        return this;
    }

}
