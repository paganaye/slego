// Hash -> 128 bits (4 x uint32) from a string
interface RNGState {
    a: number;
    b: number;
    c: number;
    d: number;
}

export class Rng128 {
    private _initialState: RNGState;
    private _state: RNGState;

    constructor(seed: string) {
        const [a, b, c, d] = Rng128.cyrb128(seed);
        this._initialState = { a, b, c, d };
        this._state = { ...this._initialState };
    }

    private static cyrb128(str: string): [number, number, number, number] {
        let h1 = 1779033703,
            h2 = 3144134277,
            h3 = 1013904242,
            h4 = 2773480762;
        for (let i = 0; i < str.length; i++) {
            const k = str.charCodeAt(i);
            h1 = Math.imul(h1 ^ k, 597399067);
            h2 = Math.imul(h2 ^ k, 2869860233);
            h3 = Math.imul(h3 ^ k, 951274213);
            h4 = Math.imul(h4 ^ k, 2716044179);
        }
        h1 ^= (h2 >>> 18) ^ (h3 << 12) ^ (h4 >>> 3);
        h2 ^= (h3 >>> 22) ^ (h4 << 5) ^ (h1 >>> 9);
        h3 ^= (h4 >>> 17) ^ (h1 << 13) ^ (h2 >>> 7);
        h4 ^= (h1 >>> 19) ^ (h2 << 11) ^ (h3 >>> 5);
        return [h1 >>> 0, h2 >>> 0, h3 >>> 0, h4 >>> 0];
    }

    nextFloat(): number {
        this._state.a >>>= 0;
        this._state.b >>>= 0;
        this._state.c >>>= 0;
        this._state.d >>>= 0;
        const t = (this._state.a + this._state.b) | 0;
        this._state.a = this._state.b ^ (this._state.b >>> 9);
        this._state.b = (this._state.c + (this._state.c << 3)) | 0;
        this._state.c = (this._state.c << 21) | (this._state.c >>> 11);
        this._state.d = (this._state.d + 1) | 0;
        const r = (t + this._state.d) | 0;
        this._state.c = (this._state.c + r) | 0;
        return (r >>> 0) / 4294967296; // [0,1)
    }

    nextInt(maxExclusive: number): number {
        return Math.floor(this.nextFloat() * maxExclusive);
    }

    nextIntRange(min: number, max: number): number {
        return this.nextInt(max - min + 1) + min;
    }


}