export function randomInt(min: number, max: number): number {
  const range = max - min + 1;
  const random = Math.floor(Math.random() * range);
  return random + min;
}

export function randomColor(): string {
  return [...Array(3)].map(() => Math.floor(randomInt(0, 255)).toString(16).padStart(2, '0')).join('');
}
