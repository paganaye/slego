//package com.ganaye.slego3.pages;
//
//import android.content.Context;
//import android.util.AttributeSet;
//import android.widget.RelativeLayout;
//
//import java.util.Random;
//
///**
// * Created by pascal on 13/01/2017.
// */
////public class Cross extends View {
////    public Cross(Context context, AttributeSet attrs, int defStyle) {
////        super(context, attrs, defStyle);
////    }
//
//public class Cross extends RelativeLayout /* implements OnTouchListener */{
//    Tile[] crossArray;
//
//    public Cross(Context context, AttributeSet attrs) {
//        super(context, attrs);
//        crossArray = new Tile[5];
//
//        for (int x = 0; x < 5; x++) {
//            crossArray[x] = new Tile(context, attrs);
//            this.addView(crossArray[x]);
//        }
//        crossArray[0].setColor(0, false);
//        crossArray[1].setColor(1, false);
//        crossArray[2].setColor(2, false);
//        crossArray[3].setColor(3, false);
//        crossArray[3].setColor(4, false);
//    }
//
//    @Override
//    protected void onLayout(boolean changed, int logo_l, int t, int r, int b) {
//
//        // super.onLayout(changed, logo_l, t, r, b);
//
//        int w = r - logo_l;
//        int h = b - t;
//
//        int lf = w < h ? w : h;
//
//        int ln0 = 0;
//        int ln1 = lf / 3;
//        int ln2 = 2 * ln1;
//        int ln3 = 3 * ln1;
//
//        if (crossArray == null || crossArray[0] == null)
//            return;
//        crossArray[0].layout(ln1, ln0, ln2, ln1);
//        crossArray[1].layout(ln0, ln1, ln1, ln2);
//        crossArray[2].layout(ln1, ln1, ln2, ln2);
//        crossArray[3].layout(ln2, ln1, ln3, ln2);
//        crossArray[4].layout(ln1, ln2, ln2, ln3);
//    }
//
//    public void randomCross(Random rnd) {
//        crossArray[0].setRandomColorOrBlank(rnd, false); // top
//        crossArray[1].setRandomColorOrBlank(rnd, false); // left
//        crossArray[2].setRandomColor(rnd, false); // the center of the cross is never
//        crossArray[3].setRandomColorOrBlank(rnd, false); // right
//        crossArray[4].setRandomColorOrBlank(rnd, false); // bottom
//    }
//
//    public Tile getTopTile() {
//        return crossArray[0];
//    }
//
//    public Tile getLeftTile() {
//        return crossArray[1];
//    }
//
//    public Tile getCenterTile() {
//        return crossArray[2];
//    }
//
//    public Tile getRightTile() {
//        return crossArray[3];
//    }
//
//    public Tile getBottomTile() {
//        return crossArray[4];
//    }
//
//    public void Clear(boolean invalidate) {
//        for (int i = 0; i < 5; i++) {
//            crossArray[i].setColor(0, invalidate);
//        }
//    }
//
//    public int[] getCrossColors() {
//        int[] crossColors = new int[5];
//        for (int i = 0; i < 5; i++)
//            crossColors[i] = crossArray[i].getColor();
//        return crossColors;
//    }
//
//    public void setCrossColors(int[] crossColors, boolean invalidate) {
//        for (int i = 0; i < 5; i++)
//            crossArray[i].setColor(crossColors[i], invalidate);
//    }
//
//    public void setStringValue(String string) {
//        for (int i = 0; i < 5; i++)
//            if (i < string.length()) {
//                String s1 = string.substring(i, i + 1);
//                crossArray[i].setColor(Integer.parseInt(s1), true);
//            }
//    }
//
//    public String getValueString() {
//        StringBuilder result = new StringBuilder();
//        for (int i = 0; i < 5; i++)
//            result.append(crossArray[i].getColor());
//        return result.toString();
//    }
//
//    public void invalidateTiles() {
//        for (int i = 0; i < 5; i++)
//            crossArray[i].invalidate();
//    }
//}
