package com.ganaye.slego3.scores;

import java.util.ArrayList;

public class Round {
	public int roundTotal;
	public int multiplier;
	public ArrayList<RoundLine> scoreLines;
	public ArrayList<RoundOverwrittenTile> overwrittenTiles;

	public Round() {
		scoreLines = new ArrayList<RoundLine>();
		overwrittenTiles = new ArrayList<RoundOverwrittenTile>();
	}

	public int getScore() {
		int result = 0;
		for (RoundLine line : scoreLines) {
			result += line.getScore();
		}
		result *= scoreLines.size();
		result -= overwrittenTiles.size();
		return result;
	}

}
