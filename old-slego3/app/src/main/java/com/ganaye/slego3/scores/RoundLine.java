package com.ganaye.slego3.scores;

public class RoundLine {
	public RoundLine(int x, int y, int color, boolean isHorizontal, int length) {
		this.x = x;
		this.y = y;
		this.isHorizontal = isHorizontal;
		this.length = length;
		this.color = color;
	}
	public int color;
	public int x;
	public int y;
	public boolean isHorizontal;
	public int length;
	public int score;

	public int getScore() {
		switch (length) {
		case 3:
			return 10;
		case 4:
			return 20;
		case 5:
			return 30;
		}
		return 0;
	}
}
