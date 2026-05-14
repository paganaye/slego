package com.ganaye.slego;

import android.app.Application;
import android.os.Build;
import android.os.Handler;
import android.util.Log;
import android.view.ViewGroup;
import android.view.animation.AccelerateDecelerateInterpolator;
import android.view.animation.Animation;
import android.view.animation.Interpolator;
import android.view.animation.ScaleAnimation;
import android.widget.FrameLayout;

import com.ganaye.modtrack.Module;
import com.ganaye.modtrack.MusicPlayer;
import com.ganaye.slego.model.Game;
import com.ganaye.slego.ui.AppFrame;
import com.ganaye.slego.ui.IScreen;
import com.ganaye.slego.ui.MainActivity;
import com.ganaye.slego.ui.about.AboutScreen;
import com.ganaye.slego.ui.game.GameScreen;
import com.ganaye.slego.ui.game.SoundEffects;
import com.ganaye.slego.ui.mainmenu.MainMenuScreen;
import com.ganaye.slego.ui.options.OptionsScreen;

import java.util.Stack;

import static com.ganaye.slego.utils.AnimationUtils.fixAnimations;

public class SlegoApp extends Application {
    public final static boolean DEBUG = BuildConfig.DEBUG;
    public final static int ANIMATION_MULTIPLIER = 10;
    public final static int NAVIGATION_DURATION = 40 * ANIMATION_MULTIPLIER;
    public final static int TILE_IMAGE_COUNT = 4; // TYPICALLY it is 4

    private static final String TAG = "SlegoApp";
    private static SlegoApp instance;
    private final Stack<NavigateScreen> screenStack = new Stack<>();
    private final Handler handler = new Handler();
    private Game currentGame;
    public boolean musicStarted;
    public float fingerOffsetX, fingerOffsetY;
    private MainActivity mainActivity;
    private MusicPlayer musicPlayer;
    private boolean activityPaused;
    private AppFrame appFrame;
    private IScreen currentScreen;
    private long seed = 0;

    public SlegoApp() {
        instance = this;
        fixAnimations();
        createNewGame();
        screenStack.push(NavigateScreen.MainMenu);
        //screenStack.push(NavigateScreen.About);
        screenStack.push(NavigateScreen.Game);
    }

    public void createNewGame() {
        seed += 1;
        currentGame = new Game(seed, 40);
    }


    public static SlegoApp getInstance() {
        return instance;
    }

    public static void setEnterAnimation(NavigateAnimation enterAnimation, AppFrame appFrame) {
        //Log.d(TAG, "animateAppFrame w:" + w + " h:" + h + " enter animation: " + enterAnimation);
        Animation birth;
        switch (enterAnimation) {
            case enterFromLeft:
                birth = new ScaleAnimation(0, 1,
                        1, 1, 0, 0, Animation.RELATIVE_TO_SELF, Animation.RELATIVE_TO_SELF);
                break;
            case enterFromRight:
                birth = new ScaleAnimation(0, 1, 1, 1, 1, 0, Animation.RELATIVE_TO_SELF, Animation.RELATIVE_TO_SELF);
                break;
            default:
                birth = new ScaleAnimation(0.25f, 1f, 0.25f, 1,
                        0.5f, 0.25f);
                break;
            // death=null;
        }
        birth.setInterpolator(interpolator());
        birth.setDuration(NAVIGATION_DURATION);
        appFrame.setAnimation(birth);
        birth.start();
    }

    public static Interpolator interpolator() {
        return new AccelerateDecelerateInterpolator();
    }

    private void setLeaveAnimation(NavigateAnimation enterAnimation) {
        Animation death = null;
        switch (enterAnimation) {
            case enterFromLeft:
                death = new ScaleAnimation(1, 0, 1, 1, 1, 0,
                        Animation.RELATIVE_TO_SELF, Animation.RELATIVE_TO_SELF);
                break;
            case enterFromRight:
                death = new ScaleAnimation(1, 0, 1, 1, 0, 0,
                        Animation.RELATIVE_TO_SELF, Animation.RELATIVE_TO_SELF);
                break;
            default:
                // death=null;
        }
        if (death != null) {
            death.setDuration(NAVIGATION_DURATION);
            death.setInterpolator(interpolator());
            appFrame.setAnimation(death);
            death.start();
        }
    }

    public boolean isActivityPaused() {
        return activityPaused;
    }

    public Game getCurrentGame() {
        return currentGame;
    }

    public void navigateTo(NavigateScreen newScreen, NavigateAnimation animation) {
        if (newScreen != getScreenStack()) {
            Log.d(TAG, "navigateTo()");
            screenStack.push(newScreen);
            displayCurrentScreen(animation);
        }
    }

    private void displayCurrentScreen(NavigateAnimation enterAnimation) {
        Log.d(TAG, "displayCurrentScreen()");
        MainActivity activity = this.mainActivity;
        if (activity == null) return;
        if (this.currentScreen != null) currentScreen.onMainActivityPaused();

        if (appFrame != null) {
            appFrame.dispose();
            setLeaveAnimation(enterAnimation);
        }
        this.currentScreen = createRootView(currentGame);

        appFrame = new AppFrame(activity, currentGame, currentScreen); //, enterAnimation);
        setEnterAnimation(enterAnimation, appFrame);
        mainActivity.setContentView(appFrame, new FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
        // if (currentScreen != null) currentScreen.onMainActivityResumed();
    }

    public void onMainActivityCreated(MainActivity mainActivity) {
        Log.d(TAG, "onMainActivityCreated()");
        if (mainActivity.getIntent().getBooleanExtra("QUIT_APPLICATION", false)) {
            Log.d(TAG, "we have been asked to quit");
            if (android.os.Build.VERSION.SDK_INT >= 21) {
                mainActivity.finishAndRemoveTask();
            } else {
                mainActivity.finish();
                Log.d(TAG, "so we exit");
                System.exit(0);
            }
        } else {
            this.mainActivity = mainActivity;
            displayCurrentScreen(NavigateAnimation.enterFromCenter);
        }
        if (!musicStarted) {
            startMusic();
            musicStarted = true;
        }
    }

    private void startMusic() {
        handler.postDelayed(() -> {
            try {
                // drozerix_dream_candy          tiring after a while
                // drozerix_crush                ok
                // drozerix_computer_fuck        tiring after a while
                // girl_from_mars                best so far
                // drozerix_leisurely_voice      not bad at all perhaps second best
                // drozerix_digital_rendezvous   not bad, a bit repetitive
                // drozerix_mecanum_overdrive
                // miafan2010_you_would_be_here
                // x4_rndd
                Module module = new Module(getResources().openRawResource(R.raw.x4_rndd));
                boolean interpolation = false;
                boolean loop = true;
                musicPlayer = new MusicPlayer(this, module, interpolation, loop);
                Thread thread = new Thread(musicPlayer);
                thread.start();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }, 1);
    }

    public void onMainActivityPaused(MainActivity mainActivity) {
        Log.d(TAG, "onMainActivityPaused()");
        if (mainActivity == this.mainActivity) this.mainActivity = null;
        activityPaused = true;
        SoundEffects.play(R.raw.sfx_sounds_pause3_in);
        handler.postDelayed(() -> {
            // we give 500ms chance for the application to return (rotations)
            if (activityPaused && musicPlayer != null) {
                musicPlayer.pause();
            }
        }, 500);
        if (currentScreen != null) currentScreen.onMainActivityPaused();
    }

    public void onMainActivityResumed(MainActivity mainActivity) {
        Log.d(TAG, "onMainActivityResumed()");
        this.mainActivity = mainActivity;
        activityPaused = false;
        SoundEffects.play(R.raw.sfx_sounds_pause3_out);
        if (musicPlayer != null) {
            musicPlayer.resume();
        }
        if (currentScreen != null) currentScreen.onMainActivityResumed();
    }

    public NavigateScreen getScreenStack() {
        if (screenStack.isEmpty()) return null;
        return screenStack.peek();
    }

    private boolean popCurrentScreen() {
        Log.d(TAG, "popCurrentScreen()");
        boolean handled = false;
        if (screenStack.size() > 0) {
            screenStack.pop();
        }
        if (screenStack.size() > 0) {
            displayCurrentScreen(NavigateAnimation.enterFromLeft);
            handled = true;
        }
        return handled;
    }

    public void onBackPressed() {
        if (!popCurrentScreen()) {
            boolean mainActivityIsDestroyed = false;
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN_MR1) {
                mainActivityIsDestroyed = mainActivity != null && mainActivity.isDestroyed();
            }
            if (mainActivity != null && !mainActivity.isFinishing() && !mainActivityIsDestroyed) {
                mainActivity.finish();
            }
        }
    }

    public void onMainActivityDestroyed(MainActivity _mainActivity) {
        if (appFrame != null) {
            appFrame.dispose();
            appFrame = null;
        }
    }

    public IScreen createRootView(Game game) {
        IScreen rootView;
        switch (SlegoApp.getInstance().getScreenStack()) {
            case Game:
                rootView = new GameScreen(mainActivity, game);
                break;
            case About:
                rootView = new AboutScreen(mainActivity);
                break;
            case Options:
                rootView = new OptionsScreen(mainActivity);
                break;
            default: // MainMenu
                rootView = new MainMenuScreen(mainActivity);
                break;
        }
        return rootView;
    }

}
