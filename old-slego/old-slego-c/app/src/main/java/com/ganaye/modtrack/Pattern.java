package com.ganaye.modtrack;

import android.annotation.SuppressLint;

@SuppressLint("UnknownNullness")

public class Pattern {
    public int numRows;
    public byte[] data;

    public Pattern(int numChannels, int numRows) {
        this.numRows = numRows;
        data = new byte[numChannels * numRows * 5];
    }

    public Note getNote(int index, Note note) {
        int offset = index * 5;
        note.key = data[offset] & 0xFF;
        note.instrument = data[offset + 1] & 0xFF;
        note.volume = data[offset + 2] & 0xFF;
        note.effect = data[offset + 3] & 0xFF;
        note.param = data[offset + 4] & 0xFF;
        return note;
    }
}
