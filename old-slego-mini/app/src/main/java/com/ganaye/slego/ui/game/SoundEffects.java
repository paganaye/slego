package com.ganaye.slego.ui.game;

import android.media.AudioFormat;
import android.media.AudioManager;
import android.media.AudioTrack;

import com.ganaye.slego.SlegoApp;

import java.io.IOException;
import java.io.InputStream;

public class SoundEffects {
    private static int minBufferSize = AudioTrack.getMinBufferSize(44100, AudioFormat.CHANNEL_CONFIGURATION_MONO,
            AudioFormat.ENCODING_PCM_16BIT);


    public static void play(int id) {
        Thread t5sec = new Thread() {
            public void run() {
                playSync(id);
            }
        };
        t5sec.start();
    }


    private static void playSync(int id) {
        try {
            AudioTrack audioTrack = audioTrack = new AudioTrack(AudioManager.STREAM_MUSIC,
                    44100, AudioFormat.CHANNEL_CONFIGURATION_MONO,
                    AudioFormat.ENCODING_PCM_16BIT,
                    minBufferSize, AudioTrack.MODE_STREAM);
            audioTrack.play();
            int i = 0;
            int bufferSize = 1024;
            byte[] buffer = new byte[bufferSize];
            InputStream inputStream = SlegoApp.getInstance().getResources().openRawResource(id);
            try {
                while ((i = inputStream.read(buffer)) != -1)
                    audioTrack.write(buffer, 0, i);
            } catch (IOException e) {
                e.printStackTrace();
            }
            inputStream.close();
            audioTrack.release();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}
