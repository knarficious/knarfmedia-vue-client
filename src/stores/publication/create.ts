import { defineStore } from "pinia";
import api from "@/utils/apiFormData";
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

      const formdata = new FormData();
      formdata.append("title", payload.title ?? '') ;
      formdata.append("summary", payload.summary ?? '' );
      formdata.append("content", payload.content ?? '');
      formdata.append("file", payload.file ?? '');
      //const tagsPayload = JSON.stringify(payload.tags);
      formdata.append("tags", payload.tags ?? '');      

      try {
        const response = await api("publications", {
          method: "POST",
          body: formdata,
        });

        const data: Publication = await response.json()
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
