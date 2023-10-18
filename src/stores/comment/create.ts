import { defineStore } from "pinia";
import api from "@/utils/api";
import type { Comment } from "@/types/comment";
import type { CommentPublicationState } from "@/types/stores";
import type { SubmissionErrors } from "@/types/error";
import { SubmissionError } from "@/utils/error";
import { useRoute } from "vue-router";

interface State extends CommentPublicationState<Comment> {}

export const useCommentCreateStore = defineStore("commentCreate", {
  
  state: (): State => ({ 
    publication: undefined,   
    created: undefined,
    isLoading: false,
    error: undefined,
    violations: undefined,
    
  }),

  
  actions: {

    async create(payload: Comment) {
      
      this.setError("");
      this.toggleLoading();
      
      try {
        // retrieve publication id from LocalStorage        
        const publicationId = localStorage.getItem("publicationId");

        const response = await api("publications/" + publicationId + "/commenter", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        const data: Comment = await response.json();

        this.toggleLoading();
        this.setCreated(data);
        // remove publication id from LocalStorage
        localStorage.removeItem("publicationId");
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

    setCreated(created: Comment) {
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
