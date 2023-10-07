import { defineStore } from "pinia";
import api from "@/utils/api";
import type { Tag } from "@/types/tag";
import type { ListState } from "@/types/stores";

interface State extends ListState<Tag> {}

export const useTagListStore = defineStore("_tagList", {
  state: (): State => ({
    items: [],
    isLoading: false,
    error: undefined,
  }),

  actions: {
    async getItems() {

      try {
        const response = await api("tags");
        const data = await response.json();        

        this.toggleLoading();

        this.setItems(data["hydra:member"]);

      } catch (error) {
        console.log(error);

        if (error instanceof Error) {
          this.setError(error.message);
        }
      }
    },

    toggleLoading() {
      this.isLoading = !this.isLoading;
    },

    setItems(items: Tag[]) {
      this.items = items;
    },

    setError(error: string) {
      this.error = error;
    },

    updateItem(updatedItem: Tag) {
      const item: Tag | undefined = this.items.find(
        (i) => i["@id"] === updatedItem["@id"]
      );

      if (!item) return;

      Object.assign(item, updatedItem);
    },

    deleteItem(deletedItem: Tag) {
      this.items = this.items.filter((item) => {
        return item["@id"] !== deletedItem["@id"];
      });
    },
  },
});
