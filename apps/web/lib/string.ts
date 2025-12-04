import { customAlphabet } from "nanoid";

const nanoid = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ");

export function getRandomBackgroundString(length: number) {
  return nanoid(length)
}