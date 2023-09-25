import { defineStore } from "pinia";
import { extractHubURL } from "@/utils/mercure";
import api from "@/utils/api";
import type { Comment } from "@/types/comment";
import type { ShowState } from "@/types/stores";

interface State extends ShowState<Comment> {}

export const useCommentShowStore = defineStore("commentShow", {
  state: (): State => ({
    retrieved: undefined,
    isLoading: false,
    error: "",
    hubUrl: undefined,
  }),

  actions: {
    async retrieve(id: string) {
      this.setError("");
      this.toggleLoading();

      try {
        const response = await api(id);
        const data: Comment = await response.json();
        const hubUrl = extractHubURL(response);

        this.toggleLoading();
        this.setRetrieved(data);

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

    setRetrieved(retrieved: Comment) {
      this.retrieved = retrieved;
    },

    setHubUrl(hubUrl: URL) {
      this.hubUrl = hubUrl;
    },

    setError(error: string) {
      this.error = error;
    },
  },
});
