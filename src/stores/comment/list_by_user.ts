import { defineStore } from "pinia";
import api from "@/utils/api";
import { extractHubURL } from "@/utils/mercure";
import type { Comment } from "@/types/comment";
import type { View } from "@/types/view";
import type { CommentListState } from "@/types/stores";
import type { PagedCollection } from "@/types/collection";

interface State extends CommentListState<Comment> {}

export const useUserCommentsListStore = defineStore("userCommentsList", {
  state: (): State => ({
    commentItems: [],
    isLoading: false,
    error: undefined,
    hubUrl: undefined,
    view: undefined,
  }),

  actions: {
    async getItems(page?: string, userId?: number) {
      this.setError("");
      this.toggleLoading();

      try {
        const path = page ? `comments?page=${page}` : "users/" + userId + "/comments";
        const response = await api(path);
        const data: PagedCollection<Comment> = await response.json();
        const hubUrl = extractHubURL(response);

        this.toggleLoading();

        this.setItems(data["hydra:member"]);
        this.setView(data["hydra:view"]);

        if (hubUrl) {
          this.setHubUrl(hubUrl);
        }
      } catch (error) {
        this.toggleLoading();

        if (error instanceof Error) {
          this.setError(error.message);
        }
      }
    },

    toggleLoading() {
      this.isLoading = !this.isLoading;
    },

    setItems(commentItems: Comment[]) {
      this.commentItems = commentItems;
    },

    setView(view: View) {
      this.view = view;
    },

    setHubUrl(hubUrl: URL) {
      this.hubUrl = hubUrl;
    },

    setError(error: string) {
      this.error = error;
    },

    updateItem(updatedItem: Comment) {
      const item: Comment | undefined = this.commentItems.find(
        (i) => i["@id"] === updatedItem["@id"]
      );

      if (!item) return;

      Object.assign(item, updatedItem);
    },

    deleteItem(deletedItem: Comment) {
      this.commentItems = this.commentItems.filter((item) => {
        return item["@id"] !== deletedItem["@id"];
      });
    },
  },
});
