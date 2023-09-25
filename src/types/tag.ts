import type { Item } from "./item";

export interface Tag extends Item {
  name?: string;
  id?: number;
}
