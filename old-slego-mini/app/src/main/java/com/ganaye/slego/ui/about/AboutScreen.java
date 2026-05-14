package com.ganaye.slego.ui.about;

import android.content.Context;
import android.view.View;

import com.ganaye.slego.SlegoApp;
import com.ganaye.slego.ui.BackgroundEffect;
import com.ganaye.slego.ui.IScreen;
import com.ganaye.slego.ui.ScrollLayout;
import com.ganaye.slego.ui.effects.PlasmaEffect;

public class AboutScreen extends ScrollLayout implements IScreen {

    public AboutScreen(Context context) {
        super(context);
        addLogo();
        addText("SLEGO 4.0 alpha release for feedback only. \n"
                + "The game is not finished, do not rate the game just yet, write to me (slego@ganaye.com)\n"
                + "\n"
                + "SLEGO is a indie game created originally in 2007 within Second Life.\n"
                + "It has been designed as a Tetris that would work within the limitation of the environment at the time.\n"
                + "Time is not a matter. The aim of the game is to place 40 tiles on a board trying to achieve the biggest score.\n"
                + "You score when you align at least three tiles of the same colour.\n"
                + "The more you align the more you score.\n"
                + "Despite its simplicity, this is a skill game.\n"
                + "Beginners will score generally no more than 200 points, advanced users will consistently score 500 points, experts will sometime score 700 points or more.\n"
                + "At the moment the rules are the same than the classic 2007 Slego Game.\n"
                + "I am thinking of adding variant rules and make player vote for their favorite set of rules.\n"
                + "So do not hesitate to share with me your suggestions or your trouble with the game.\n"
                + "On the developper side, I am doing this game for the fun to teach me the Android lower level layers.\n"
                + "The game is designed to run on all Android Phones with no compatibility libraries. We end up with a ridiculously small package size (350Kb at the moment).\n"
                + "On the artistic side, I am doing it myself, I can only do my best. The theme today is 16/32 bit Atari/Amiga. If the game gets a bit popular I'll recruit a proper design artist.\n"
                + "The fonts I used were designed for Amiga, I'll be happy to add credits if someone have any.\n"
                + "The background musics are coming from modarchive.org, they are all from drozerix.\n"
                + "Sound effects are from the Essential Retro Video Game Sound Effects Collection by Juhani Junkala"
                + "Enjoy this game.\n"
                + "Pascal GANAYE\n");
        addButton("Back", (v) -> SlegoApp.getInstance().onBackPressed());
    }

    @Override
    public BackgroundEffect getBackgroundEffect() {
        return new PlasmaEffect(getContext());
    }

    @Override
    public View getView() {
        return this;
    }

}
