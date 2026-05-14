package com.ganaye.modtrack;


import android.content.Context;
import android.media.AudioFormat;
import android.media.AudioManager;
import android.media.AudioTrack;
import android.util.Log;

public class MusicPlayer implements Runnable {
    public static final int SAMPLE_RATE = 48000;
    String TAG = "ModPlayer";
    AudioTrack audioTrack;
    private Module module;
    private IBXM micromod;
    private boolean playing, loop, isplaying;
    private int duration;
    private Context context;

    public MusicPlayer(Context context, Module module, boolean interpolation, boolean loop) {

        isplaying = true;
        this.module = module;
        micromod = new IBXM(module, SAMPLE_RATE);

        micromod.setInterpolation(Channel.SINC);
        duration = micromod.calculateSongDuration();
        this.loop = loop;
        this.context = context;
    }


    public int getDuration() {
        return duration;
    }

    public void setLoop(boolean loop) {
        this.loop = loop;

    }

    public void seek(int seek) {
        micromod.seek(seek);
    }

    public void stop() {
        playing = false;
        isplaying = false;
    }

    public void play() {

        if (!(audioTrack.getPlayState() == AudioTrack.PLAYSTATE_PLAYING)) {
            isplaying = true;

            Thread thread = new Thread(this);
            thread.start();
        }


    }

    public void pause() {
        stop();
    }

    public void resume() {
        play();
    }

    public void run() {
        try {
            int[] mixBuf = new int[micromod.getMixBufferLength()];
            byte[] outBuf = new byte[mixBuf.length * 2];
            Log.i("modplayer", "length:" + outBuf.length + " mix:" + mixBuf.length * 2);

            audioTrack = new AudioTrack(AudioManager.STREAM_MUSIC, SAMPLE_RATE,
                    AudioFormat.CHANNEL_OUT_STEREO, AudioFormat.ENCODING_PCM_16BIT, outBuf.length, AudioTrack.MODE_STREAM);

            try {
                Log.i("modplayer", "start play");
                audioTrack.play();
                int samplePos = 0;
                playing = true;
                byte[] buf = new byte[micromod.getMixBufferLength() * 2];

                WavInputStream in = new WavInputStream(micromod, duration, 0);
                int remain = in.getBytesRemaining();
                audioTrack.play();
                int len = 0;
                while (playing && (len = in.read(buf, 0, buf.length)) > -1) {
                    // Log.d(TAG, "writing " + len);
                    if (audioTrack.write(buf, 0, len) < 0) break;
                }
                audioTrack.stop();
            } finally {
                audioTrack.flush();
                audioTrack.release();
                if (loop && isplaying) {
                    this.run();
                }
            }
        } catch (Exception e) {
            Log.e(TAG, "run failed", e);
        }
    }

}


