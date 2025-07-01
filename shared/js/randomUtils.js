export function generateRandomFloatInRange(min, max) {
  return Math.random() * (max - min) + min;
}

export function generateRandomIntInRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
