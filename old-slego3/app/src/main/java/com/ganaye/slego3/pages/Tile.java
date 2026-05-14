package com.ganaye.slego3.pages;

import java.util.Random;

import com.ganaye.slego3.R;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.graphics.ColorFilter;
import android.graphics.LightingColorFilter;
import android.graphics.Paint;
import android.graphics.Rect;
import android.graphics.RectF;
import android.util.AttributeSet;
import android.view.View;
import android.view.animation.AlphaAnimation;
import android.view.animation.Animation;
import android.view.animation.Animation.AnimationListener;
import android.view.animation.AnimationSet;
import android.view.animation.RotateAnimation;

public class Tile extends View {

	private int mTileX;
	private int mTileY;
	boolean mHighLight;
	private int mColor;
	private int mAnimatedColor;
	private RectF mTileBounds;
	private int mPreviousColor;
	private static Paint normalPaint;
	private static Paint highlightPaint;
	private static Rect bitmapRect;
	private static ColorFilter highlightColorFilter;
	private static Bitmap redBitmap;
	private static Bitmap blueBitmap;
	private static Bitmap yellowBitmap;
	private static Bitmap greenBitmap;
	private static Bitmap back2Bitmap;

	public Tile(Context context, AttributeSet attrs) {
		super(context, attrs);
	}

	public void initStaticVariables() {
		redBitmap = BitmapFactory
				.decodeResource(getResources(), R.drawable.tile_blue);
		blueBitmap = BitmapFactory.decodeResource(getResources(),
				R.drawable.tile_blue);
		yellowBitmap = BitmapFactory.decodeResource(getResources(),
				R.drawable.tile_purple);
		greenBitmap = BitmapFactory.decodeResource(getResources(),
				R.drawable.tile_green);
		back2Bitmap = BitmapFactory.decodeResource(getResources(),
				R.drawable.tile_gray);
		bitmapRect = new Rect(0, 0, redBitmap.getWidth(), redBitmap.getHeight());
		highlightColorFilter = new LightingColorFilter(0x808080, 0x101010);

		normalPaint = new Paint(0);
		highlightPaint = new Paint(0);
		highlightPaint.setColorFilter(highlightColorFilter);
	}

	@Override
	protected void onSizeChanged(int w, int h, int oldw, int oldh) {
		// TODO Auto-generated method stub
		super.onSizeChanged(w, h, oldw, oldh);
		mTileBounds = new RectF(0, 0, w, h);
	}

	@Override
	protected void onLayout(boolean changed, int left, int top, int right,
			int bottom) {
		if (redBitmap == null) {
			initStaticVariables();
		}
		super.onLayout(changed, left, top, right, bottom);
		// new RectF(w / 4, h / 4, 3 * w / 4, 3 * h / 4);
	}

	/*
	 * <ImageView android:id="@+id/imageView1"
	 * android:contentDescription="SLEGO logo"
	 * android:layout_width="wrap_content" android:layout_height="wrap_content"
	 * android:src="@drawable/slego_text" />
	 */
	protected void onDraw(Canvas canvas) {
		super.onDraw(canvas);
		RectF bounds = mTileBounds;
		Bitmap bitmap = null;

		switch (mAnimatedColor != 0 ? mAnimatedColor : mColor) {
		case 1: // R.id.tile_blue:
			bitmap = redBitmap;
			break;
		case 2: // R.id.blue:
			bitmap = blueBitmap;
			break;
		case 3: // R.id.purple:
			bitmap = yellowBitmap;
			break;
		case 4: // R.id.green:
			bitmap = greenBitmap;
			break;
		case -1:
			bitmap = back2Bitmap;
			break;
		}

		if (bitmap != null) {
			Paint paint = mHighLight ? highlightPaint : normalPaint;
			canvas.drawBitmap(bitmap, bitmapRect, bounds, paint);
		}
	}

	public void setRandomColorOrBlank(Random rnd, boolean invalidate) {
		if (rnd.nextInt(4) == 0)
			setColor(0, invalidate);
		else
			setRandomColor(rnd, invalidate);
	}

	public void setRandomColor(Random rnd, boolean invalidate) {
		setColor(rnd.nextInt(4) + 1, invalidate);
	}

	public int getColor() {
		return mColor;
	}

	public void setColor(int color, boolean invalidate) {
		if (color > 4)
			color = 0;
		mPreviousColor = mColor;
		mColor = color;
		mAnimatedColor = 0;
		if (invalidate) {
			this.clearAnimation();
			this.invalidate();
		}
	}

	public void setTileXY(int x, int y) {
		mTileX = x;
		mTileY = y;
	}

	public int getTileX() {
		return mTileX;
	}

	public int getTileY() {
		return mTileY;
	}

	public boolean IsBlank() {
		// TODO Auto-generated method stub
		return mColor == 0;
	}

	public void setHighlight(boolean b) {
		if (mHighLight == b)
			return;
		mHighLight = b;
		this.invalidate();
	}

	public void animateAndClear(int color) {
		mAnimatedColor = color;
		AnimationSet set1 = new AnimationSet(true);
		Animation animation1 = new RotateAnimation(-3, 3,
				Animation.RELATIVE_TO_SELF, 0.5f, Animation.RELATIVE_TO_SELF,
				0.5f);
		animation1.setDuration(75);
		animation1.setRepeatCount(10);

		Animation animation2 = new AlphaAnimation(1f, 0f);
		animation2.setDuration(400);
		animation2.setStartOffset(1000);

		set1.addAnimation(animation1);
		set1.addAnimation(animation2);

		set1.setAnimationListener(new AnimationListener() {

			@Override
			public void onAnimationStart(Animation animation) {
			}

			@Override
			public void onAnimationRepeat(Animation animation) {
			}

			@Override
			public void onAnimationEnd(Animation animation) {
				mAnimatedColor = 0;
				invalidate();
			}
		});
		startAnimation(set1);
	}

	public void clearAfterAnimation() {
		if (mColor == 0)
			return;
		mAnimatedColor = mColor;
		mColor = 0;
		mPreviousColor = 0;
	}

	public void stopAnimation() {
		if (mAnimatedColor != 0) {
			mAnimatedColor = 0;
			clearAnimation();
			invalidate();
		}
	}
}
