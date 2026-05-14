export interface IState<T> {
  getValue(): T;
  observe(observer: (value: T) => void): RemoveObserverFunction;
}

type RemoveObserverFunction = { (): void; }

