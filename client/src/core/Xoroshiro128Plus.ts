export class Xoroshiro128Plus {
  s0: bigint;
  s1: bigint;

  constructor(
    seed1: number | bigint,
    seed2: number | bigint = 0x123456789abcdef0n
  ) {
    this.s0 = BigInt(seed1) & 0xffffffffffffffffn;
    this.s1 = BigInt(seed2) & 0xffffffffffffffffn;
    this.next();
  }

  // Rotate left
  private rotl(x: bigint, k: bigint) {
    return (x << k) | (x >> (64n - k));
  }

  private next() {
    const result = this.s0 + this.s1;

    const s1 = this.s0 ^ this.s1;
    this.s0 = this.rotl(this.s0, 24n) ^ s1 ^ (s1 << 16n);
    this.s1 = this.rotl(s1, 37n);

    return result;
  }

  // Generate a random number between 0 and max - 1
  getRand(max: number | bigint) {
    return Number(this.next() % BigInt(max));
  }
}
