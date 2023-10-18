import type { View } from "@/types/view";
import type { SubmissionErrors } from "./error";

export interface LoginState<T> {
  retrieved?: T;
  isLoggedIn? : boolean;
  isLoading: boolean;
  error?: string;
  violations?: SubmissionErrors;
  isAdmin?: boolean
}

export interface CreateState<T> {
  created?: T;
  isLoading: boolean;
  error?: string;
  violations?: SubmissionErrors;
}

export interface CommentPublicationState<T> {
  publication: any;
  created?: T;
  isLoading: boolean;
  error?: string;
  violations?: SubmissionErrors;
}

export interface DeleteState<T> {
  deleted?: T;
  mercureDeleted?: T;
  isLoading: boolean;
  error?: string;
}

export interface ListState<T> {
  items: T[];
  isLoading: boolean;
  error?: string;
  hubUrl?: URL;
  view?: View;
}

export interface CommentListState<T> {
  commentItems: T[];
  isLoading: boolean;
  error?: string;
  hubUrl?: URL;
  view?: View;
}

export interface ShowState<T> {
  retrieved?: T;
  isLoggedIn? : boolean;
  isLoading: boolean;
  error?: string;
  hubUrl?: URL;
  violations?: SubmissionErrors;
}

export interface UpdateState<T> {
  updated?: T;
  retrieved?: T;
  isLoading: boolean;
  error?: string;
  hubUrl?: URL;
  violations?: SubmissionErrors;
}
