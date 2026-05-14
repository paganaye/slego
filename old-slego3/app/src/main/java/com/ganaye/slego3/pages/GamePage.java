package com.ganaye.slego3.pages;

import android.content.Context;
import android.content.SharedPreferences;
import android.graphics.Matrix;
import android.media.SoundPool;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.support.annotation.Nullable;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentActivity;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuItem;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.view.ViewTreeObserver;
import android.view.animation.AlphaAnimation;
import android.view.animation.Animation;
import android.view.animation.AnimationSet;
import android.view.animation.ScaleAnimation;
import android.view.animation.TranslateAnimation;
import android.widget.AbsoluteLayout;
import android.widget.ImageView;
import android.widget.TextView;

import com.ganaye.slego3.R;
import com.ganaye.slego3.core.SlegoApplication;
import com.ganaye.slego3.scores.Round;
import com.ganaye.slego3.scores.RoundLine;
import com.ganaye.slego3.scores.RoundOverwrittenTile;
import com.ganaye.slego3.views.Board;
import com.ganaye.slego3.views.Cross;
import com.ganaye.slego3.views.Tile;

import java.util.Random;

import static android.content.Context.MODE_PRIVATE;


/**
 * A simple {@link Fragment} subclass.
 * Activities that contain this fragment must implement the
 * {@link GamePage.OnFragmentInteractionListener} interface
 * to handle interaction events.
 * <p>
 * create an instance of this fragment.
 */
public class GamePage extends Fragment implements View.OnTouchListener {
    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";
    final float crossZoom = 1.1f;
    Board board;
    Cross cross;
    View gameView;
    AbsoluteLayout.LayoutParams dockedCrossLayoutParams;
    TextView textScore, textRound;
    SlegoApplication slegoApplication;
    boolean soundsLoaded = false;
    SharedPreferences sharedPreferences;
    Handler mHandler = new Handler();
    Round mCurrentRound;
    boolean busy;
    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;
    private OnFragmentInteractionListener mListener;
    private int mRound;
    private int mScore;
    private int mBestScore;
    //private Button btnMenu;
    private SoundPool soundPool;
    private int coinDropSoundID;
    private int tileDroppedSoundID;
    private AbsoluteLayout mainLayout;
    private int mGameNo;

    public GamePage() {
        // Required empty public constructor
    }


    public static int[] getBitmapOffset(ImageView img, Boolean includeLayout) {
        int[] offset = new int[2];
        float[] values = new float[9];

        Matrix m = img.getImageMatrix();
        m.getValues(values);

        offset[0] = (int) values[5];
        offset[1] = (int) values[2];

        if (includeLayout) {
            ViewGroup.MarginLayoutParams lp = (ViewGroup.MarginLayoutParams) img
                    .getLayoutParams();
            int paddingTop = (int) (img.getPaddingTop());
            int paddingLeft = (int) (img.getPaddingLeft());

            offset[0] += paddingTop + lp.topMargin;
            offset[1] += paddingLeft + lp.leftMargin;
        }
        return offset;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {
            mParam1 = getArguments().getString(ARG_PARAM1);
            mParam2 = getArguments().getString(ARG_PARAM2);
        }
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View mainView = inflater.inflate(R.layout.page_game, container, false);

        //setContentView(R.layout.page_game);

        return mainView;
    }


    @Override
    public void onViewCreated(View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        final FragmentActivity activity = this.getActivity();
        board = (Board) activity.findViewById(R.id.slegoBoard);
        cross = (Cross) activity.findViewById(R.id.slegoCross);
        gameView = activity.findViewById(R.id.gameView);
        textRound = (TextView) activity.findViewById(R.id.slegoRoundText);
        textScore = (TextView) activity.findViewById(R.id.slegoScoreText);
        //btnMenu = (Button) findViewById(R.id.btnMenu);
        mainLayout = (AbsoluteLayout) gameView.getParent();

        //btnMenu.setOnClickListener(this);

        gameView.setOnTouchListener(this);

        sharedPreferences = activity.getSharedPreferences("slego", MODE_PRIVATE);


        mGameNo = sharedPreferences.getInt("gameNo", 0);
        mRound = sharedPreferences.getInt("round" + mGameNo, 0);

        if (mRound == 0) {
            restartGame();
        } else {
            mScore = sharedPreferences.getInt("score" + mGameNo, 0);
            mBestScore = sharedPreferences.getInt("bestScore", 0);
            cross.setStringValue(sharedPreferences.getString("cross" + mGameNo, ""));
            board.setStringValue(sharedPreferences.getString("board" + mGameNo, ""));
            showCrossScoreAndRounds();
        }

        final ViewTreeObserver vto = board.getViewTreeObserver();
        if (vto != null) {
            vto.addOnPreDrawListener(new ViewTreeObserver.OnPreDrawListener() {
                private AbsoluteLayout.LayoutParams crossLayoutParams;

                @Override
                public boolean onPreDraw() {
                    View crossArea = activity.findViewById(R.id.crossArea);

                    dockedCrossLayoutParams = new AbsoluteLayout.LayoutParams(
                            crossArea.getWidth(), crossArea.getHeight(),
                            crossArea.getLeft(), crossArea.getTop());

                    crossLayoutParams = new AbsoluteLayout.LayoutParams(
                            crossArea.getWidth(), crossArea.getHeight(),
                            crossArea.getLeft(), crossArea.getTop());

                    cross.setLayoutParams(dockedCrossLayoutParams);

                    ViewTreeObserver vto = cross.getViewTreeObserver();
                    vto.removeOnPreDrawListener(this);
                    return true;
                }
            });

        }
        // Set the hardware buttons to control the music
        //this.setVolumeControlStream(AudioManager.STREAM_MUSIC);
        // Load the sound
        //soundPool = new SoundPool(10, AudioManager.STREAM_MUSIC, 0);
//        soundPool.setOnLoadCompleteListener(new Loader.OnLoadCompleteListener() {
//            @Override
//            public void onLoadComplete(SoundPool soundPool, int sampleId,
//                                       int status) {
//                soundsLoaded = true;
//            }
//        });
        //coinDropSoundID = soundPool.load(this, R.raw.coin_drop_1, 1);
        //tileDroppedSoundID = soundPool.load(this, R.raw.effect_tick, 1);


    }

    // TODO: Rename method, update argument and hook method into UI event
    public void onButtonPressed(Uri uri) {
        if (mListener != null) {
            mListener.onFragmentInteraction(uri);
        }
    }

    @Override
    public void onAttach(Context context) {
        super.onAttach(context);
        if (context instanceof OnFragmentInteractionListener) {
            mListener = (OnFragmentInteractionListener) context;
        }
    }

    @Override
    public void onDetach() {
        super.onDetach();
        mListener = null;
    }


    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();

        //noinspection SimplifiableIfStatement
//        if (id == R.id.action_settings) {
//            return true;
//        }

        return super.onOptionsItemSelected(item);
    }

    //@Override
    public void finish() {
//        Log.w("SlegoGame", "finish");
//
//        boolean complete = (mRound > 40);
//
//        getIntent().putExtra("complete", complete);
//        setResult(RESULT_OK, getIntent());
//
//        super.finish();
    }

    @Override
    public void onPause() {
//        Log.w("SlegoGame", "onPause");
//        SharedPreferences.Editor editor = sharedPreferences.edit();
//        editor.putInt("round" + mGameNo, mRound);
//        editor.putInt("score" + mGameNo, mScore);
//        editor.putInt("bestScore", mBestScore);
//        editor.putString("cross" + mGameNo, cross.getValueString());
//        editor.putString("board" + mGameNo, board.getValueString());
//        editor.commit();
//        //MusicService.onPause();
        super.onPause();
    }

    @Override
    public void onResume() {
        Log.w("SlegoGame", "onResume");
        super.onResume();
        //MusicService.onResume();
    }

    @Override
    public void onStart() {
        Log.w("SlegoGame", "onStart");
        super.onStart();
    }

    @Override
    public void onStop() {
        Log.w("SlegoGame", "onStop");
        super.onStop();
    }

    private void restartGame() {
        this.mRound = 0;
        this.mScore = 0;
        nextRound();
        showCrossScoreAndRounds();
        board.clear();
    }

    private void showCrossScoreAndRounds() {
        textScore.setText(String.format("%03d pts", mScore));
        if (mRound > 40) {
            textRound.setText("Game Complete");
            cross.Clear(true);
        } else {
            textRound.setText(String.format("%02d/40", mRound));
            if (dockedCrossLayoutParams != null) {
                cross.setLayoutParams(dockedCrossLayoutParams);
            }
            // for security
            board.stopAnimatedTiles();

            cross.invalidateTiles();
            Animation animation1 = new AlphaAnimation(0f, 1f);
            animation1.setDuration(500);
            animation1.setFillAfter(true);
            cross.startAnimation(animation1);
        }

    }

    private void nextRound() {
        if (mRound > 40)
            return;
        mRound++;
        if (mRound <= 40) {
            Random rnd;
            if (mGameNo == 0) rnd = new Random();
            else rnd = new Random(((long) 30052007) * mGameNo + ((long) 23051969) * mRound);
            cross.randomCross(rnd);
        } else {
            saveScore();
        }
    }

    //@Override
    public boolean onMenuItemSelected(int featureId, MenuItem item) {
//		switch (item.getItemId()) {
//		case R.id.action_pass:
//			pass();
//			break;
//		case R.id.action_restart:
//			if (mRound > 40) {
//				restartGame();
//			} else
//				new AlertDialog.Builder(this)
//						.setTitle("Restart Game")
//						.setMessage(
//								"Are you sure you want to restartGame the game?")
//						.setPositiveButton("Yes",
//								new DialogInterface.OnClickListener() {
//									public void onClick(DialogInterface dialog,
//											int which) {
//										restartGame();
//									}
//								}).setNegativeButton("No", null).show();
//			break;
//		/*
//		 * case R.id.action_scores:
//		 *
//		 * try { Pattern emailPattern = Patterns.EMAIL_ADDRESS; // API level 8+
//		 * Account[] accounts = AccountManager.get(this).getAccounts(); for
//		 * (Account account : accounts) { if
//		 * (emailPattern.matcher(account.name).matches()) { // String
//		 * possibleEmail = account.name; new AlertDialog.Builder(this)
//		 * .setTitle("User:") .setMessage(account.name + "\n" + account.type)
//		 * .setPositiveButton("OK", new DialogInterface.OnClickListener() {
//		 * public void onClick( DialogInterface dialog, int which) { }
//		 * }).show();
//		 *
//		 * } } } catch (Exception e) { new AlertDialog.Builder(this)
//		 * .setTitle("Error") .setMessage(e.getMessage())
//		 * .setPositiveButton("OK", new DialogInterface.OnClickListener() {
//		 * public void onClick(DialogInterface dialog, int which) { } }).show();
//		 *
//		 * } break;
//		 */
//		}
//        return super.onMenuItemSelected(featureId, item);
        return true;
    }

    protected void pass() {
        nextRound();
        showCrossScoreAndRounds();
    }

    //@Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
//        getMenuInflater().inflate(R.menu.activity_game_menu, menu);
        return true;
    }

    void playCross(final int X, final int Y) {
        if (mRound > 40)
            return;
        if (X >= 0 && X <= 4 && Y >= 0 && Y <= 4) {
            busy = true;
            mCurrentRound = new Round();

            play1(X, Y - 1, cross.getTopTile());
            play1(X - 1, Y, cross.getLeftTile());
            play1(X, Y, cross.getCenterTile());
            play1(X + 1, Y, cross.getRightTile());
            play1(X, Y + 1, cross.getBottomTile());

            for (RoundOverwrittenTile tile : mCurrentRound.overwrittenTiles) {
                addTemporaryView(tile.x, tile.y, 1f, 1f,
                        R.layout.minus1, 1);
            }

            AnimationSet crossAnimation = new AnimationSet(true);

            Animation animation1 = new ScaleAnimation(1f, 1f / crossZoom, 1f,
                    1f / crossZoom, Animation.RELATIVE_TO_SELF, 0.5f,
                    Animation.RELATIVE_TO_SELF, 0.5f);
            animation1.setDuration(100);

            Animation animation2 = new AlphaAnimation(1f, 0f);
            animation2.setDuration(1);
            animation2.setStartOffset(100);

            crossAnimation.addAnimation(animation1);
            crossAnimation.addAnimation(animation2);
            crossAnimation.setFillAfter(true);
            crossAnimation.setAnimationListener(new Animation.AnimationListener() {

                @Override
                public void onAnimationStart(Animation animation) {

                }

                @Override
                public void onAnimationRepeat(Animation animation) {

                }

                @Override
                public void onAnimationEnd(Animation animation) {
                    afterPlayCross(X, Y);
                }

            });
            cross.startAnimation(crossAnimation);

        } else {
            cross.setLayoutParams(dockedCrossLayoutParams);
            setAlpha(cross, 1f);
        }
    }

    private void afterPlayCross(final int X, final int Y) {
        playSound(tileDroppedSoundID);

        board.checkLines(mCurrentRound, X - 1, X + 1, Y - 1, Y + 1);

        int roundScore = mCurrentRound.getScore();

        mScore += roundScore;

        if (mScore < 0)
            mScore = 0;

        nextRound();

        int nbOverWritten = mCurrentRound.overwrittenTiles.size();

        int m2 = mCurrentRound.scoreLines.size();
        final int multiplierRes = m2;

        board.postDelayed(new Runnable() {
            //            ImageView imageView1;
//
            @Override
            public void run() {
//                if (imageView1 != null) {
//                    final ImageView imageViewToDelete = imageView1;
//                    // mainLayout.post(new Runnable() {
//                    // public void run() {
//                    mainLayout.removeView(imageViewToDelete);
//                    // }
//                    // });
//                }
                if (mCurrentRound.scoreLines.size() == 0) {
                    afterRemoveLines();
                    return;
                }
//
                playSound(coinDropSoundID);
//
                RoundLine line = mCurrentRound.scoreLines.get(0);
                mCurrentRound.scoreLines.remove(0);
                int res = 0;
//                int res2 = 0;
//                switch (line.length) {
//                    case 3:
//                        res2 = R.drawable.p10;
//                        break;
//                    case 4:
//                        res2 = R.drawable.p20;
//                        break;
//                    case 5:
//                        res2 = R.drawable.p30;
//                        break;
//                }
//
                if (line.isHorizontal) {
//                    switch (line.length) {
//                        case 3:
//                            res = R.drawable.arrow_horizontal;
//                            break;
//                        case 4:
//                            res = R.drawable.h4;
//                            break;
//                        case 5:
//                            res = R.drawable.h5;
//                            break;
//                    }
//
//                    imageView1 = addImageView(mainLayout, line.x, line.y,
//                            line.length, 1f, res);
                    addTemporaryView(line.x, line.y, line.length, 1f, R.layout.arrow_horizontal, 0);


//
                    addTemporaryView(line.x + ((float) line.length - 1)
                            / 2f, line.y, 1f, 1f, R.layout.gained_points, -1);
//                    if (multiplierRes > 0) {
//                        addTemporaryView(mainLayout, line.x
//                                        + ((float) line.length - 1) / 2f, line.y, 1f,
//                                1f, multiplierRes, -1);
//                    }
                } else {
//                    switch (line.length) {
//                        case 3:
//                            res = R.drawable.v3;
//                            break;
//                        case 4:
//                            res = R.drawable.v4;
//                            break;
//                        case 5:
//                            res = R.drawable.v5;
//                            break;
//                    }
//
                    addTemporaryView(line.x, line.y, 1f, line.length, R.layout.arrow_vertical, 0);

                    addTemporaryView(line.x, line.y
                            + ((float) line.length - 1) / 2f, 1f, 1f, R.layout.gained_points, -1);

//                    if (multiplierRes > 0) {
//                        addTemporaryView(mainLayout, line.x, line.y
//                                        + ((float) line.length - 1) / 2f, 1f, 1f,
//                                multiplierRes, -1);
//                    }
                }
                for (int i = 0; i < line.length; i++) {
                    Tile t = board.getTile(
                            line.x + (line.isHorizontal ? i : 0), line.y
                                    + (line.isHorizontal ? 0 : i));
                    t.animateAndClear(line.color);
                }
                board.postDelayed(this, 1000);
            }

        }, nbOverWritten > 0 ? 500 : 0);
    }

    protected void afterRemoveLines() {
        showCrossScoreAndRounds();
        busy = false;
    }

    private void addTemporaryView(float x, float y,
                                  float w, float h, int res, int anim) {
        LayoutInflater li = LayoutInflater.from(getActivity());


        final View imageView1 = li.inflate(res, null);

        imageView1.setLayoutParams(new AbsoluteLayout.LayoutParams((int) (board
                .getTileWidth() * w), (int) (board.getTileHeight() * h),
                (int) (board.getTileWidth() * x + board.getLeft()),
                (int) (board.getTileHeight() * y + board.getTop())));

        mainLayout.addView(imageView1);

        Animation animation1 = new AlphaAnimation(1f, 0f);
        animation1.setStartOffset(500);
        animation1.setDuration(500);

        AnimationSet animationSet = new AnimationSet(true);
        animationSet.addAnimation(animation1);
        Animation animation2 = null;

        switch (anim) {
            case -1:
                animation2 = new TranslateAnimation(Animation.RELATIVE_TO_SELF, 0f,
                        Animation.RELATIVE_TO_SELF, 0f, Animation.RELATIVE_TO_SELF,
                        0f, Animation.RELATIVE_TO_SELF, -2f);
                break;
            case 1:
                animation2 = new TranslateAnimation(Animation.RELATIVE_TO_SELF, 0f,
                        Animation.RELATIVE_TO_SELF, 0f, Animation.RELATIVE_TO_SELF,
                        0f, Animation.RELATIVE_TO_SELF, 1f);
                break;
        }
        if (animation2 != null) {
            animation2.setDuration(400);
            animation2.setStartOffset(600);
            animationSet.addAnimation(animation2);
        }
        animationSet.setAnimationListener(new Animation.AnimationListener() {

            @Override
            public void onAnimationStart(Animation animation) {
            }

            @Override
            public void onAnimationRepeat(Animation animation) {
            }

            @Override
            public void onAnimationEnd(Animation animation) {
                mainLayout.post(new Runnable() {
                    public void run() {
                        mainLayout.removeView(imageView1);
                    }
                });
            }
        });
        imageView1.startAnimation(animationSet);
    }


    private View addView(float x,
                         float y, float w, float h, int res) {
        LayoutInflater li = LayoutInflater.from(getActivity());
        View view = li.inflate(res, null);

        view.setLayoutParams(new AbsoluteLayout.LayoutParams((int) (board
                .getTileWidth() * w), (int) (board.getTileHeight() * h),
                (int) (board.getTileWidth() * x + board.getLeft()),
                (int) (board.getTileHeight() * y + board.getTop())));

        mainLayout.addView(view);
        return view;
    }

    private void playSound(int soundId) {
        // Getting the user sound settings
        //AudioManager audioManager = (AudioManager) getSystemService(AUDIO_SERVICE);
//        float actualVolume = (float) audioManager
//                .getStreamVolume(AudioManager.STREAM_MUSIC);
//        float maxVolume = (float) audioManager
//                .getStreamMaxVolume(AudioManager.STREAM_MUSIC);
//        float volume = actualVolume / maxVolume;
        // Is the sound loaded already?
        if (soundsLoaded
                && sharedPreferences.getBoolean("pref_sound_effects", true)) {
            //soundPool.play(soundId, volume, volume, 1, 0, 1f);
        }
    }

    private void play1(int x, int y, Tile tile) {
        if (board.isValid(x, y) && !tile.IsBlank()) {
            if (!board.isBlank(x, y)) {

                mCurrentRound.overwrittenTiles.add(new RoundOverwrittenTile(x,
                        y));
            }
            board.play1(x, y, tile);
        }
    }

    //@Override
    public boolean onTouch(View v, MotionEvent motionEvent) {
        if (busy)
            return true;
        int[] gameViewXY = new int[2];
        gameView.getLocationOnScreen(gameViewXY);

        int x = 0, y = 0;
        x = (int) motionEvent.getRawX();
        y = (int) motionEvent.getRawY();

        int w = (int) (crossZoom * 3.0 * board.getTileWidth());
        int h = (int) (crossZoom * 3.0 * board.getTileHeight());

        int[] boardLoc = new int[2];
        board.getLocationOnScreen(boardLoc);

        double dx = (x - boardLoc[0]) / (double) board.getTileWidth();
        double dy = (y - boardLoc[1]) / (double) board.getTileHeight();
        int tx = (int) Math.round(dx - 0.5);
        int ty = (int) Math.round(dy - 0.5);

        switch (motionEvent.getAction()) {
            case MotionEvent.ACTION_DOWN:
            case MotionEvent.ACTION_MOVE:
            case MotionEvent.ACTION_UP:
                if (tx >= 0 && tx <= 4 && ty >= 0 && ty <= 4) {
                    x = (int) Math.round(boardLoc[0] + tx * board.getTileWidth()
                            - w / 2 + board.getTileWidth() / 2 - gameViewXY[0]);
                    y = (int) Math.round(boardLoc[1] + ty * board.getTileHeight()
                            - h / 2 + board.getTileHeight() / 2 - gameViewXY[1]);
                    setAlpha(cross, 1.0f);

                } else {
                    x = (int) Math.round(x - w / 2 - gameViewXY[0]);
                    y = (int) Math.round(y - h / 2 - gameViewXY[1]);
                    setAlpha(cross, 0.5f);
                }
                AbsoluteLayout.LayoutParams crossLayoutParams = new AbsoluteLayout.LayoutParams(w, h, x, y);
                cross.setLayoutParams(crossLayoutParams);
                if (motionEvent.getAction() == motionEvent.ACTION_UP) {
                    Log.w("SlegoGame", "Touch ACTION_UP");
                    playCross(tx, ty);
                }
                break;
            default:
                Log.d("touch", "action:" + motionEvent.getAction());
                break;
        }
        return true;
    }

    void setAlpha(final View view, float v) {
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.HONEYCOMB) {
            view.setAlpha(v);
        } else {
            Animation animation1 = new AlphaAnimation(v, v);
            animation1.setDuration(1);
            animation1.setFillAfter(true);
            view.startAnimation(animation1);
        }
    }

    @Override
    public void onDestroy() {
        Log.w("SlegoGame", "onDestroy");
        super.onDestroy();
    }

//    @Override
//    protected void onSaveInstanceState(Bundle outState) {
//        Log.w("SlegoGame", "onSaveInstanceState");
//        super.onSaveInstanceState(outState);
//    }
//
//    @Override
//    protected void onRestoreInstanceState(Bundle savedInstanceState) {
//        Log.w("SlegoGame", "onRestoreInstanceState");
//        super.onRestoreInstanceState(savedInstanceState);
//    }

    //@Override
    public void onClick(View arg0) {
//        if (arg0 == btnMenu) {
//            openOptionsMenu();
//        }
    }

//    @Override
//    public boolean onPrepareOptionsMenu(Menu menu) {
//        MenuItem mnu1 = menu.findItem(R.id.action_pass);
//        if (mnu1 != null)
//            mnu1.setVisible(mRound <= 40);
//        return super.onPrepareOptionsMenu(menu);
//    }

    public void saveScore() {
        if (mScore <= 0)
            return;
        if (mScore > mBestScore)
            mBestScore = mScore;
//		GamesClient client = getGamesClient();
//		if (client == null || !client.isConnected()) {
//			Toast.makeText(this,
//					"As you have not logged in yet, this score won't be saved.",
//					Toast.LENGTH_SHORT).show();
//			return;
//		}
//		client.submitScore(getString(R.string.leaderboard_slego_score), mScore);
    }
//
//	@Override
//	public void onSignInFailed() {
//	}
//
//	@Override
//	public void onSignInSucceeded() {
//	}

    /**
     * This interface must be implemented by activities that contain this
     * fragment to allow an interaction in this fragment to be communicated
     * to the activity and potentially other fragments contained in that
     * activity.
     * <p>
     * See the Android Training lesson <a href=
     * "http://developer.android.com/training/basics/fragments/communicating.html"
     * >Communicating with Other Fragments</a> for more information.
     */
    public interface OnFragmentInteractionListener {
        // TODO: Update argument type and name
        void onFragmentInteraction(Uri uri);
    }
}
