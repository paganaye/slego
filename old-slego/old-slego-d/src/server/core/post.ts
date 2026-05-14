import { context, reddit } from '@devvit/web/server';

export const createPost = async () => {
  const { subredditName } = context;
  console.log("I am in createPost");
  console.log("subredditName: " + subredditName);

  if (!subredditName) {
    throw new Error('subredditName is required');
  }

  return await reddit.submitCustomPost({
    splash: {
      appDisplayName: 'SLEGO',
      // backgroundUri: 'background.png',
      // buttonLabel: 'Start Playing',
      // description: 'An exciting interactive experience',
      // heading: 'Welcome to the Game!'
    },
    subredditName: subredditName,
    title: 'SLEGO - Classic 40 Rounds Puzzle Game',
  });
};
