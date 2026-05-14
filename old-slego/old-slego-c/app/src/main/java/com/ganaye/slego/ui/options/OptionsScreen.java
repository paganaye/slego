package com.ganaye.slego.ui.options;

import android.content.Context;
import android.view.View;

import com.ganaye.slego.SlegoApp;
import com.ganaye.slego.ui.BackgroundEffect;
import com.ganaye.slego.ui.IScreen;
import com.ganaye.slego.ui.ScrollLayout;
import com.ganaye.slego.ui.effects.BlueScreenEffect;

public class OptionsScreen extends ScrollLayout implements IScreen {

    public OptionsScreen(Context context) {
        super(context);
        addRoundButton("<", "Your game is paused.", (v) ->
                SlegoApp.getInstance().onBackPressed());
        addText("This is the options screen\n");
        addButton("Back", (v) -> SlegoApp.getInstance().onBackPressed());


    }


    @Override
    protected void onLayout(boolean changed, int l, int t, int r, int b) {
        super.onLayout(changed, l, t, r, b);
    }

    @Override
    public BackgroundEffect getBackgroundEffect() {
        return new BlueScreenEffect(getContext());
        // new StarFieldEffect(getContext());
    }

    @Override
    public View getView() {
        return this;
    }

}
