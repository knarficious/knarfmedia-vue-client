import { defineStore } from "pinia";
import api from "@/utils/api";
import type { Comment } from "@/types/comment";
import type { DeleteState } from "@/types/stores";

interface State extends DeleteState<Comment> {}

export const useCommentDeleteStore = defineStore("commentDelete", {
  state: (): State => ({
    deleted: undefined,
    mercureDeleted: undefined,
    isLoading: false,
    error: undefined,
  }),

  actions: {
    async deleteItem(item: Comment) {
      this.setError("");
      this.toggleLoading();

      if (!item?.["@id"]) {
        this.setError("No comment found. Please reload");
        return;
      }

      try {
        await api(item["@id"], { method: "DELETE" });

        this.toggleLoading();
        this.setDeleted(item);
        this.setMercureDeleted(undefined);
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

    setDeleted(deleted: Comment) {
      this.deleted = deleted;
    },

    setMercureDeleted(mercureDeleted: Comment | undefined) {
      this.mercureDeleted = mercureDeleted;
    },

    setError(error: string) {
      this.error = error;
    },
  },
});
