import { defineStore, acceptHMRUpdate } from "pinia";
import api  from "@/utils/api";
import type { User } from "@/types/user";
import type { SubmissionErrors } from "@/types/error";
import { SubmissionError } from "@/utils/error";
import type { ShowState } from "@/types/stores";
import { useCookies } from "vue3-cookies";
import jwt_decode from "jwt-decode";

interface State extends ShowState<User> {}

export const useUserAuthStore = defineStore("userAuth", {
  state: (): State => ({
    retrieved: undefined ,
    isLoggedIn: false,
     isLoading: false,
     error: undefined,
     violations: undefined,
    }),
  getters: {
    getIsLoggedIn: (state) => state.isLoggedIn,
  },
  actions: {
    async login(payload: User) {
      this.setError("");
      this.toggleLoading();

      try {
        const response = await api("auth", {
          method: "POST",
          body: JSON.stringify(payload),
        });

        console.log('response: ', response.headers);

        const {cookies} = useCookies();
        const jwt = cookies.get("jwt_hp");

        if (response.status === 204 && jwt !== null) {

          this.toggleLoading();
          this.setIsLoggedIn(true);          
          
          console.log('jwt: ', jwt);

          const decoded: any = jwt_decode(jwt);
          console.log(decoded);
          const username = decoded.username;
          localStorage.setItem('_username', username);          

          alert("Vous êtes correctement authentifié ;-) " + username);
        }

        else alert("Il y a un souci :-(");
        this.toggleLoading();

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

    setIsLoggedIn(status = false) {
      this.isLoggedIn = status ? status : !this.isLoggedIn;
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

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserAuthStore, import.meta.hot));
}
