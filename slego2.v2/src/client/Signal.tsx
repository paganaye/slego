import { createSignal } from "solid-js";

export class Signal<T> {
    readonly get: () => T;
    readonly set: (value: T) => void;

    constructor(value: T, readonly comparer?: (a: T, b: T) => boolean) {
        [this.get, this.set] = createSignal(value, { equals: comparer ?? false } );
    }
}
