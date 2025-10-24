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
    chargement: false,
    erreur: undefined,
    violations: undefined,
    
  }),

  
  actions: {

    async create(payload: Comment) {
      
      this.setError("");
      this.toggleLoading();
      
      try {
        // retrieve publication id from LocalStorage        
        const publicationId = localStorage.getItem("publicationId");
        if (!publicationId) {
          this.setError("Publication ID missing");
          this.toggleLoading();
          return;
        }

        const url = `${publicationId}/commenter`;
const response = await api(url, {
  method: "POST",
  body: JSON.stringify(payload),
  headers: {
    "Content-Type": "application/json",
  },
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
      this.chargement = !this.chargement;
    },

    setError(error: string) {
      this.erreur = error;
    },

    setViolations(violations: SubmissionErrors) {
      this.violations = violations;
    },
  },
  
});
