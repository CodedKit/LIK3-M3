
export type Scene = {
  id: string;
  title: string;
  character: string;
  avatar: string; // URL or path to the avatar image
  storyFile: string; // Path to the compiled .ink.json story file
};

export type SceneDefinitions = {
  [id: string]: Scene;
};
