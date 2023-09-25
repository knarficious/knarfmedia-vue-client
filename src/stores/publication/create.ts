import { defineStore } from "pinia";
import api from "@/utils/api";
import type { Publication } from "@/types/publication";
import type { CreateState } from "@/types/stores";
import type { SubmissionErrors } from "@/types/error";
import { SubmissionError } from "@/utils/error";

interface State extends CreateState<Publication> {}

export const usePublicationCreateStore = defineStore("publicationCreate", {
  state: (): State => ({
    created: undefined,
    isLoading: false,
    error: undefined,
    violations: undefined,
  }),

  actions: {
    async create(payload: Publication) {
      this.setError("");
      this.toggleLoading();

      try {
        const response = await api("publications", {
          method: "POST",
          body: JSON.stringify(payload)
        });
        const data: Publication = await response.json();
        console.log('data: ', data);

        this.toggleLoading();
        this.setCreated(data);
      } catch (error) {
        this.toggleLoading();

        if (error instanceof SubmissionError) {
          this.setViolations(error.errors);
          this.setError(error.errors._error);
          return;
        }

        if (error instanceof Error) {
          this.setError(error.message);
        }
      }
    },

    setCreated(created: Publication) {
      this.created = created;
    },

    toggleLoading() {
      this.isLoading = !this.isLoading;
    },

    setError(error: string) {
      this.error = error;
    },

    setViolations(violations: SubmissionErrors) {
      this.violations = violations;
    },
  },
});
