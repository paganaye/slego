package com.ganaye.slego3.activities;

import com.ganaye.slego3.R;
import com.ganaye.slego3.services.MusicService;

import android.content.Intent;
import android.os.Bundle;
import android.preference.Preference;
import android.preference.Preference.OnPreferenceChangeListener;
import android.preference.PreferenceActivity;
import android.preference.PreferenceManager;
import android.view.View;
import android.widget.ListView;

public class SlegoPreferences extends PreferenceActivity {

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
        PreferenceManager prefMgr = getPreferenceManager();
        prefMgr.setSharedPreferencesName("slego");
        prefMgr.setSharedPreferencesMode(MODE_PRIVATE);
		
//		addPreferencesFromResource(R.xml.slego_preferences);
		Preference music = findPreference("pref_music");
		music.setOnPreferenceChangeListener(new OnPreferenceChangeListener() {
			@Override
			public boolean onPreferenceChange(Preference preference,
					Object newValue) {
				Intent musicService = new Intent(SlegoPreferences.this, MusicService.class);
				if (newValue.equals(true)) {
					startService(musicService);
				}
				else
				{
					stopService(musicService);
				}
				return true;
				// Do stuff
			}
		});
	}

	@Override
	protected void onListItemClick(ListView l, View v, int position, long id) {
		super.onListItemClick(l, v, position, id);
	}



	
}
