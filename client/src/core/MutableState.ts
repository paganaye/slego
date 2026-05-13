import { IState } from "./State";

const JsValueTypes = new Set(["number", "boolean", "string", "undefined", "null", "bigint", "symbol"])

export class MutableState<T> implements IState<T> {
  private value: T;
  private observers: ((newValue: T) => void)[] = [];
  constructor(initialValue: T) {
    this.value = initialValue;
  }

  public getValue(): T {
    return this.value;
  }

  public setValue(newValue: T) {
    if (newValue === null || JsValueTypes.has(typeof newValue)) {
      // we just ignore unchanging valueTypes     
      if (newValue === this.value) return;
    }
    this.value = newValue as T;
    this.raiseValueChanged();
  }

  protected _initValue(newValue: T) {
    this.value = newValue as T;
    // no value changed
  }

  public observe(observer: (value: T) => void) {
    this.observers.push(observer);
    return () => {
      let idx = this.observers.indexOf(observer);
      if (idx >= 0) this.observers.splice(idx, 1);
    };
  }

  protected raiseValueChanged() {
    let val = this.value;
    if (this.observers.length) {
      for (let o of this.observers) {
        o(val);
      }
    }
  }
}

export function join(...inputs: IState<any>[]): IState<string> {
  return new Func("join", (...vals) =>
    vals.join(""), ...inputs)
}

export function hh_mm_ss(dateTime: IState<Date>): IState<string> {
  const hours = func("hours", (dt) =>
    dt.getHours(), dateTime);
  const minutes = func("minutes", (dt) =>
    dt.getMinutes(), dateTime);
  const seconds = func("seconds", (dt) =>
    dt.getSeconds(), dateTime);
  const milliSeconds = func("milliseconds", (dt) =>
    dt.getMilliseconds(), dateTime);

  const hh = func("hh", (hours) =>
    String(hours).padStart(2, "0"), hours);
  const mm = func("mm", (minutes) =>
    String(minutes).padStart(2, "0"), minutes);
  const ss = func("ss", (seconds) =>
    String(seconds).padStart(2, "0"), seconds);
  const ms = func("ss", (ms) =>
    String(ms).padStart(3, "0"), milliSeconds);

  return func("", (hh, mm, ss, ms) =>
    `${hh}:${mm}:${ss}.${ms}`, hh, mm, ss, ms);
}

export function constState<T>(value: T): IState<T> {
  return new ConstState(value);
}

class ConstState<T> implements IState<T> {
  constructor(readonly value: T) { }

  getValue(): T {
    return this.value;
  }
  observe(_observer: (value: T) => void): () => void {
    return () => { }
  }

}

type ExtractTypes<T extends IState<any>[]> = {
  [K in keyof T]: T[K] extends IState<infer U> ? U : never;
};

export function func<U, T extends IState<any>[]>(name: string,
  calc: (...args: ExtractTypes<T>) => U,
  ...inputs: T) {
  return new Func(name, calc, ...inputs)
}

class Func<U, T extends IState<any>[]> implements IState<U> {
  protected values: ExtractTypes<T>;
  protected inputs: T;
  private state: MutableState<U>;

  protected calcValue(): U {
    return this.calc(...this.values);
  }

  constructor(
    readonly name: string,
    protected readonly calc: (...args: ExtractTypes<T>) => U,
    ...inputs: T) {
    this.inputs = inputs;
    this.values = inputs.map((input) => input.getValue()) as any;
    inputs.forEach((input, idx) => {
      input.observe((val) => {
        this.values[idx] = val;
        this.state.setValue(this.calcValue());
      })
    })
    this.state = new MutableState<U>(this.calcValue());
  }

  getValue(): U {
    return this.state.getValue();
  }

  observe(observer: (value: U) => void): () => void {
    return this.state.observe(observer)
  }
}