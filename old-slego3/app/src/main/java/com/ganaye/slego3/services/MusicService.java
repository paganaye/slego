package com.ganaye.slego3.services;

import com.ganaye.slego3.R;

import android.app.Activity;
import android.app.Application.ActivityLifecycleCallbacks;
import android.app.Service;
import android.content.Intent;
import android.media.MediaPlayer;
import android.media.MediaPlayer.OnCompletionListener;
import android.os.Bundle;
import android.os.IBinder;

public class MusicService extends Service implements OnCompletionListener {
	static MediaPlayer mediaPlayer;
	int nbActivityStarted;

	@Override
	public IBinder onBind(Intent intent) {
		return null;
	}

	@Override
	public void onCreate() {
		//mediaPlayer = MediaPlayer.create(this, R.raw.torley_125);// raw/logo_s.mp3
		mediaPlayer.setVolume(0.25f, 0.25f);
		mediaPlayer.setOnCompletionListener(this);
		// getApplication().registerActivityLifecycleCallbacks(this);
	}

	@Override
	public int onStartCommand(Intent intent, int flags, int startId) {
		if (!mediaPlayer.isPlaying()) {
			mediaPlayer.start();
		}
		return START_REDELIVER_INTENT;
	}

	public void onDestroy() {
		if (mediaPlayer.isPlaying()) {
			mediaPlayer.stop();
		}
		mediaPlayer.release();
		mediaPlayer = null;
	}

	public void onCompletion(MediaPlayer _mediaPlayer) {
		mediaPlayer.start();
	}

	public static void onPause() {
		if (mediaPlayer != null) {
			mediaPlayer.pause();
		}
	}

	public static void onResume() {
		if (mediaPlayer != null) {
			mediaPlayer.start();
		}
	}
}