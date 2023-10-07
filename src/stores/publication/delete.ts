import { defineStore } from "pinia";
import api from "@/utils/api";
import type { Publication } from "@/types/publication";
import type { DeleteState } from "@/types/stores";

interface State extends DeleteState<Publication> {}

export const usePublicationDeleteStore = defineStore("publicationDelete", {
  state: (): State => ({
    deleted: undefined,
    mercureDeleted: undefined,
    isLoading: false,
    error: undefined,
  }),

  getters: {
    getIsDeleted: (state) => state.deleted
  },

  actions: {
    async deleteItem(item: Publication) {
      this.setError("");
      this.toggleLoading();

      if (!item?.["@id"]) {
        this.setError("No publication found. Please reload");
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

    setDeleted(deleted: Publication) {
      this.deleted = deleted;
    },

    setMercureDeleted(mercureDeleted: Publication | undefined) {
      this.mercureDeleted = mercureDeleted;
    },

    setError(error: string) {
      this.error = error;
    },
  },
});
