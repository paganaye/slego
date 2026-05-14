package com.ganaye.slego.model;

import com.ganaye.core.MutableValue;
import com.ganaye.core.Observable;

public class BoardTile {
    private final int tileNo;
    public final int x;
    public final int y;
    private MutableValue<TileImage> _tileImage = new MutableValue<>(this, null);
    public Observable<TileImage> tileImage = _tileImage.getObservable();

    public BoardTile(int tileNo) {
        this.tileNo = tileNo;
        this.x = tileNo % 5;
        this.y = (tileNo / 5);
    }

    public void setTileImage(TileImage newShape) {
        _tileImage.setValue(newShape);
    }

    public TileImage getTileImage() {
        return _tileImage.getValue();
    }
}
