export function makePercent(arr: number[]): number[] {
  const off = 100 - arr.reduce((acc: number, x: number) => acc + Math.round(x), 0);
  return arr.map((x: number, i: number) => Math.round(x) + (off > i ? 1 : 0) - (i >= arr.length + off ? 1 : 0));
}
