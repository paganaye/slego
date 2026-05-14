type AchievementLevel = "bronze" | "silver" | "gold"

interface IAchievement {
  description: string;
  level: AchievementLevel;
  hidden?: boolean;
}

export const achievements: Record<string, IAchievement> = {
  opened_the_app: { description: "Opened the app", level: "bronze" },  
  one_piece: { description: "Placed one piece on the board", level: "bronze" },
  one_line_of_three: { description: "Made a line of three", level: "bronze" },
  one_line_of_four: { description: "Made a line of four", level: "silver" },
  one_line_of_five: { description: "Made a line of five", level: "gold" },
  big_cross: { description: "Made the big cross", level: "gold", hidden: true },
  multiplier_x2: { description: "Made a x2 multiplier", level: "bronze" },
  multiplier_x3: { description: "Made a x3 multiplier", level: "silver" },
  multiplier_x4: { description: "Made a x4 multiplier", level: "gold" },
  multiplier_x5: { description: "Made a x5 multiplier", level: "gold", hidden: true },
  multiplier_x6: { description: "Made a x6 multiplier", level: "gold", hidden: true },
  finished_a_game: { description: "Finished your first game", level: "bronze" },
  finished_10_games: { description: "Finished 10 games", level: "bronze" },
  finished_100_games: { description: "Finished 100 games", level: "silver" },
  finished_1_000_games: { description: "Finished 1,000 games", level: "silver" },
  finished_10_0000_games: { description: "Finished 10,000 games", level: "gold", hidden: true },
  finished_100_0000_games: { description: "Finished 100,000 games", level: "gold", hidden: true },
  played_for_two_days: { description: "Played for two days", level: "bronze" },
  played_for_a_week: { description: "Played for a week", level: "silver" },
  played_for_a_month: { description: "Played for a month", level: "gold" },
  played_for_a_year: { description: "Played for a year", level: "gold", hidden: true },
  finished_the_tutorial: { description: "Finished the tutorial", level: "silver" },
  finished_with_nothing: { description: "Finished with a score of zero", level: "silver", hidden: true },
  finished_with_less_than_100pts: { description: "Finished with less than 100pts", level: "silver", hidden: true },
  finished_with_100pts: { description: "Finished with 100pts", level: "bronze" },
  finished_with_200pts: { description: "Finished with 200pts", level: "bronze" },
  finished_with_300pts: { description: "Finished with 300pts", level: "silver" },
  finished_with_400pts: { description: "Finished with 400pts", level: "silver" },
  finished_with_500pts: { description: "Finished with 500pts", level: "gold" },
  finished_with_600pts: { description: "Finished with 600pts", level: "gold", hidden: true },
  finished_with_700pts: { description: "Finished with 700pts", level: "gold", hidden: true },
  finished_with_800pts: { description: "Finished with 800pts", level: "gold", hidden: true },
  finished_with_900pts: { description: "Finished with 900pts", level: "gold", hidden: true },
  finished_with_1000pts: { description: "Finished with 1000pts", level: "gold", hidden: true },
}

