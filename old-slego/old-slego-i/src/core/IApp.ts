import { Layer } from "../controls/Layer";
import { IState } from "./State";
import { IRect } from "./Types";

export interface IAnimationFrame {
  readonly time: number;
  readonly deltaT: number;
}

export interface INavigateOptions {
  saveToHistory: boolean
}

export interface IApp extends Layer {
  readonly isBusy: boolean;
  readonly tickNo: IState<number>;
  readonly rect: IState<IRect>
  readonly animationFrame: IState<IAnimationFrame>
  readonly nowInt: IState<number>;
  readonly nowDate: IState<Date>;

  setFocus(crossLayer: Layer): void;
  delay(duration: number): Promise<void>;
  animate(action: (p: number) => void, duration?: number): Promise<void>;
  runBlocking<T>(action: () => Promise<T>): Promise<T | undefined>;
  navigateTo(page?: string, args?: any[], options?: Partial<INavigateOptions>): void
}

