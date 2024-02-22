import { defineStore, acceptHMRUpdate } from "pinia";
import api  from "@/utils/api";
import type { User } from "@/types/user";
import type { SubmissionErrors } from "@/types/error";
import { SubmissionError } from "@/utils/error";
import type { LoginState } from "@/types/stores";
import { useCookies } from "vue3-cookies";
import jwt_decode from "jwt-decode";

const {cookies} = useCookies();
interface State extends LoginState<User> {}

export const useUserAuthStore = defineStore("userAuth", {
  state: (): State => ({
    retrieved: undefined ,
    isLoggedIn: false,
    isLoading: false,
    error: undefined,
    violations: undefined,
    isAdmin: false,
    }),
  getters: {
    getIsLoggedIn: (state) => state.isLoggedIn,
    getUser: (state) => state.retrieved,
    getIsAdmin: (state) => state.isAdmin
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

        if (response.status === 204 && cookies.isKey("jwt_hp")) {

          this.toggleLoading();
          this.setIsLoggedIn(true);

          const jwt = cookies.get("jwt_hp");

          const decoded: any = jwt_decode(jwt);
          const id = decoded.id;
          const roles = decoded.roles;;

          if (roles.includes("ROLE_ADMIN")) {
            this.setIsAdmin(true);            
          }

          try {
            const response = await api("users/" + id);
            const data: User = await response.json();
            this.setRetrieved(data);
  
            alert("Vous êtes correctement authentifié ;-) " + data.username);
          } 
          catch (error) {
            this.toggleLoading();
          }

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
    async logout() {
      
      if (this.getIsLoggedIn === true && cookies.isKey("jwt_hp")) {
        try {
         
          const response = await api("token/invalidate");
          if (response.status === 200) {
            
            cookies.remove("jwt_hp");
            cookies.remove("jwt_s");
            this.setIsLoggedIn(false);
            //alert("Vous êtes maintenant déconnecté");
            location.reload();
          }
          }  
  
         catch (error) {
          console.log(error);
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
    setRetrieved(retrieved: User) {
      this.retrieved = retrieved;
    },

    setIsAdmin(isAdmin = false) {
      this.isAdmin = isAdmin ? isAdmin : !this.isAdmin;
    }
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserAuthStore, import.meta.hot));
}
