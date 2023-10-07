import { defineStore } from "pinia";
import api from "@/utils/api";
import { extractHubURL } from "@/utils/mercure";
import type { Publication } from "@/types/publication";
import type { UpdateState } from "@/types/stores";
import type { SubmissionErrors } from "@/types/error";
import { SubmissionError } from "@/utils/error";

interface State extends UpdateState<Publication> {}

export const usePublicationUpdateStore = defineStore("publicationUpdate", {
  state: (): State => ({
    updated: undefined,
    retrieved: undefined,
    isLoading: false,
    error: undefined,
    hubUrl: undefined,
    violations: undefined,
  }),

  actions: {
    async retrieve(id: string) {
      this.setError("");
      this.toggleLoading();

      try {
        const response = await api(id);
        const data: Publication = await response.json();
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


    async update(payload: Publication) {
      this.setError("");
      this.toggleLoading();

      if (!this.retrieved?.["@id"]) {
        this.setError("No publication found. Please reload");
        return;
      }

      const formdata = new FormData();
      formdata.set("title", payload.title ?? '') ;
      formdata.set("summary", payload.summary ?? '' );
      formdata.set("content", payload.content ?? '');
      formdata.set("file", payload.file ?? '');
      const tagsPayload = JSON.stringify(payload.tags);
      formdata.set("tags", tagsPayload);   

      try {
        const newHeaders =  new Headers(
          { "Content-Type": "application/ld+json" });        

        
        const response = await api(this.retrieved["@id"], {
          method: "PATCH",
          body: formdata,
        });
        const data: Publication = await response.json();

        this.toggleLoading();
        this.setUpdated(data);
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

    setRetrieved(retrieved: Publication) {
      this.retrieved = retrieved;
    },

    setUpdated(updated: Publication) {
      this.updated = updated;
    },

    setHubUrl(hubUrl: URL) {
      this.hubUrl = hubUrl;
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
