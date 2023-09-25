import { defineStore } from "pinia";
import api from "@/utils/api";
import type { Tag } from "@/types/tag";
import type { DeleteState } from "@/types/stores";

interface State extends DeleteState<Tag> {}

export const useTagDeleteStore = defineStore("tagDelete", {
  state: (): State => ({
    deleted: undefined,
    mercureDeleted: undefined,
    isLoading: false,
    error: undefined,
  }),

  actions: {
    async deleteItem(item: Tag) {
      this.setError("");
      this.toggleLoading();

      if (!item?.["@id"]) {
        this.setError("No tag found. Please reload");
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

    setDeleted(deleted: Tag) {
      this.deleted = deleted;
    },

    setMercureDeleted(mercureDeleted: Tag | undefined) {
      this.mercureDeleted = mercureDeleted;
    },

    setError(error: string) {
      this.error = error;
    },
  },
});
