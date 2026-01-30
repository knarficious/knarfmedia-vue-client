import type { Item } from "./item";

export interface Comment extends Item {
  content?: string;
  publishedAt?: string;
  author?: object;
  post?: object | string;
  parent?: object | string;
  children?: any;
  id?: number
}
