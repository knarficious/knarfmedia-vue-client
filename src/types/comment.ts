import type { Item } from "./item";

export interface Comment extends Item {
  content?: string;
  publishedAt?: string;
  author?: object;
  id?: number
}
