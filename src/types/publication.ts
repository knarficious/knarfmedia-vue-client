import type { Item } from "./item";

export interface Publication extends Item {
  title?: string;
  summary?: string;
  content?: string;
  publishedAt?: string;
  updatedAt?: string;
  comments?: any;
  author?: any;
  tags?: any;
  file?: any;
}
