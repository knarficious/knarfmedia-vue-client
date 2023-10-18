import { defineStore } from "pinia";
import api from "@/utils/api";
import type { Publication } from "@/types/publication";
import type { ListState } from "@/types/stores";
import type { PagedCollection } from "@/types/collection";

interface State extends ListState<Publication> {}

export const useUserPublicationsListStore = defineStore("userPublicationsList", {
  state: (): State => ({
    items: [],
    isLoading: false,
    error: undefined
  }),

  actions: {
    async getItems(page?: string, userId?: number) {
      this.setError("");
      this.toggleLoading();

      try {
        const path = page ? `publications?page=${page}` : "users/" + userId + "/publications";
        const response = await api(path);
        const data: PagedCollection<Publication> = await response.json();

        this.toggleLoading();

        this.setItems(data["hydra:member"]);

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

    setItems(items: Publication[]) {
      this.items = items;
    },

    setError(error: string) {
      this.error = error;
    },

    updateItem(updatedItem: Publication) {
      const item: Publication | undefined = this.items.find(
        (i) => i["@id"] === updatedItem["@id"]
      );

      if (!item) return;

      Object.assign(item, updatedItem);
    },

    deleteItem(deletedItem: Publication) {
      this.items = this.items.filter((item) => {
        return item["@id"] !== deletedItem["@id"];
      });
    },
  },
});
