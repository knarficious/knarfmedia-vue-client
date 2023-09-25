import type { Item } from "./item";

export interface Login extends Item {
  email?: string;
  password?: string;
}
