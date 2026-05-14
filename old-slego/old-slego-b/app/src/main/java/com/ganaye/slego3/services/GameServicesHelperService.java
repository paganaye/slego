package com.ganaye.slego3.services;

import android.app.Service;
import android.content.Intent;
import android.os.IBinder;

public class GameServicesHelperService extends Service {
	  
	  @Override
	  public IBinder onBind(Intent intent) {
	    return null;
	  }

	  @Override
	  public void onCreate() {
	  }

	  @Override
	  public int onStartCommand(Intent intent, int flags, int startId) {
	    return START_STICKY;
	  }

	  public void onDestroy() {
	  }


	}