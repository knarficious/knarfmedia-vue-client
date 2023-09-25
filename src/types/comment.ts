import type { Item } from "./item";

export interface Comment extends Item {
  post?: object;
  content?: string;
  publishedAt?: string;
  author?: object;
}
