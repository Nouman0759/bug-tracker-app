import { User } from "./user";

export interface Comment {
  _id: string;
  issue: string;
  user: User;
  text: string;
  createdAt: string;
  updatedAt: string;
}
