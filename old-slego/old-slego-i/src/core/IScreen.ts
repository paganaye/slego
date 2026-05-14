import { App } from "../controls/App";
import { Layer } from "../controls/Layer";

export interface IScreen extends Layer {
  getTitle(): string;
  init(screenName: string, args: string[]): void;
}

// Interface for the constructor signature
export interface IScreenConstructor {
  new (app: App): IScreen;
}

 
