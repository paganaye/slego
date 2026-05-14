package com.ganaye.modtrack;


public class Envelope {
    public boolean enabled = false, sustain = false, looped = false;
    public int sustainTick = 0, loopStartTick = 0, loopEndTick = 0;
    public int numPoints = 1;
    public int[] pointsTick = new int[1];
    public int[] pointsAmpl = new int[1];

    public int nextTick(int tick, boolean keyOn) {
        tick++;
        if (looped && tick >= loopEndTick) tick = loopStartTick;
        if (sustain && keyOn && tick >= sustainTick) tick = sustainTick;
        return tick;
    }

    public int calculateAmplitude(int tick) {
        int ampl = pointsAmpl[numPoints - 1];
        if (tick < pointsTick[numPoints - 1]) {
            int point = 0;
            for (int idx = 1; idx < numPoints; idx++)
                if (pointsTick[idx] <= tick) point = idx;
            int dt = pointsTick[point + 1] - pointsTick[point];
            int da = pointsAmpl[point + 1] - pointsAmpl[point];
            ampl = pointsAmpl[point];
            ampl += ((da << 24) / dt) * (tick - pointsTick[point]) >> 24;
        }
        return ampl;
    }
}
