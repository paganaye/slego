package com.ganaye.slego.utils;

import android.graphics.PointF;

public class PointUtils {
    public static float getDistance(float x1, float y1, float x2, float y2) {
        float dx = x2 - x1;
        float dy = y2 - y1;
        return (float) Math.sqrt(dx * dx + dy * dy);
    }

    public static float getDistance(PointF pt1, PointF pt2) {
        return getDistance(pt1.x, pt1.y, pt2.x, pt2.y);
    }

}
