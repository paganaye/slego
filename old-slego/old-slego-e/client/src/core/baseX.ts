let baseXChars =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_*!";
let baseXMap = new Map(
  [...baseXChars].map((char, index) => [char, BigInt(index)])
);

const BASEX = BigInt(baseXChars.length);
export function toBaseX(n: number | bigint): string {
  if (!n) return "0";
  if (typeof n !== "bigint") n = BigInt(n);
  let res = "";
  while (n > 0n) {
    let n0 = n % BASEX;
    res = baseXChars[Number(n0)] + res;
    n /= BASEX;
  }
  return res;
}

export function fromBaseX(s: string): bigint {
  let res = 0n;
  if (!s) return res;
  for (let letter of s) {
    let n = baseXMap.get(letter);
    if (n === undefined)
      throw Error(
        "Invalid BaseX character: " +
        JSON.stringify(letter) +
        " in " +
        JSON.stringify(s)
      );
    res = res * BASEX + n;
  }
  return res;
}

