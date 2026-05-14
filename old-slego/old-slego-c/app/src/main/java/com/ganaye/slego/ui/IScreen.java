package com.ganaye.slego.ui;

import android.view.View;

public interface IScreen {
    BackgroundEffect getBackgroundEffect();
    View getView();
    void onMainActivityPaused();
    void onMainActivityResumed();
}
