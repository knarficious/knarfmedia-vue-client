import { defineStore } from "pinia";
import api from "@/utils/api";
import { extractHubURL } from "@/utils/mercure";
import type { Publication } from "@/types/publication";
import type { View } from "@/types/view";
import type { ListState } from "@/types/stores";
import type { PagedCollection } from "@/types/collection";

interface State extends ListState<Publication> {}

export const usePublicationListStore = defineStore("publicationList", {
  state: (): State => ({
    items: [],
    isLoading: false,
    error: undefined,
    hubUrl: undefined,
    view: undefined,
  }),

  actions: {
    async getItems(page?: string) {
      this.error = undefined;
      this.isLoading = true;

      try {
        const path = page ? `publications?page=${page}` : "publications";
        const response = await api(path);
        const data: PagedCollection<Publication> = await response.json();
        const hubUrl = extractHubURL(response);

        this.setItems(data["hydra:member"]);
        this.setView(data["hydra:view"]);

        if (hubUrl) {
          this.setHubUrl(hubUrl);
        }
      } catch (error) {        

        if (error instanceof Error) {
          this.setError(error.message);
        }
      } finally {
    this.isLoading = false;
  }
    },

    toggleLoading() {
      this.isLoading = !this.isLoading;
    },

    setItems(items: Publication[]) {
      this.items = items.map(item => ({
        ...item,
        author: item.author || null
      }));
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
