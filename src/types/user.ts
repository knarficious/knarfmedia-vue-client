import type { Item } from "./item";

export interface User extends Item {
  username?: string;
  email?: string;
  isVerified?: boolean;
  plainPassword?: string;
  id?: number;
  posts?: any;
  comments?: any
}
