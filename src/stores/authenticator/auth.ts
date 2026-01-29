import { defineStore, acceptHMRUpdate } from "pinia";
import api  from "@/utils/api";
import type { User } from "@/types/user";
import type { SubmissionErrors } from "@/types/error";
import { SubmissionError } from "@/utils/error";
import type { LoginState } from "@/types/stores";
import { useCookies } from "vue3-cookies";
import jwt_decode from "jwt-decode";
import { notify } from 'notiwind';

const {cookies} = useCookies();
interface State extends LoginState<User> {}

export const useUserAuthStore = defineStore("userAuth", {
  state: (): State => ({
    retrieved: undefined ,
    isLoggedIn: false,
    isLoading: false,
    error: undefined,
    violations: undefined,
    isVerified: false,
    isAdmin: false,
    }),
  getters: {
    getIsLoggedIn: (state) => state.isLoggedIn,
    getUser: (state) => state.retrieved,
    getIsAdmin: (state) => state.isAdmin,
    getIsVerified: (state) => state.isVerified
  },
  actions: {
    async login(payload: User) {
      this.setError("");

      try {
        const response = await api("auth", {
          method: "POST",
          body: JSON.stringify(payload),
        });

        if (response.status === 204 && cookies.isKey("jwt_hp")) {

          this.setLoading(true);

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
            if (data.isVerified == false) {
              alert("Vous devez valider votre email pour pouvoir vous connecter !");              
              
            }
  
            else {
              //alert("Vous êtes correctement authentifié ;-) " + data.username);
              notify(
                {
                  group: 'foo',
                  title: 'Succès',
                  text: 'Vous êtes correctement authentifié ;-)'+ data.username,
                },
                4000,
              ); // 4s
              this.setIsLoggedIn(true);
            } 
          } 
          catch (error) {
            ;
          } finally {
            this.setLoading(false);
          }

        }

        else if (response.status === 401) {
          notify(
            {
              group: 'foo',
              title: 'Échec',
              text: 'Identifiants incorrects ',
              type: 'error'
            }
          )

        }
        
        else alert("Il y a un souci :-(");

      } catch (error) {

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
  // Toujours nettoyer le frontend, même si l'API échoue
  try {
    if (cookies.isKey("jwt_hp")) {
      await api("token/invalidate", { method: "POST" })
    }
  } catch (error) {
    // On log, mais on n'empêche pas le logout
    console.warn("Erreur lors de l'invalidation du token", error)
  } finally {
    // Nettoyage FRONT = source de vérité
    cookies.remove("jwt_hp")
    cookies.remove("jwt_s")

    this.isLoggedIn = false
    this.retrieved = undefined
    this.isAdmin = false
    this.isVerified = false

    notify(
      {
        group: 'foo',
        title: 'À bientôt',
        text: 'Vous êtes maintenant déconnecté',
      },
      4000,
    )
  }
},

    async refresh() {
      try {
        const response = await api("token/refresh", { method: "POST" });

        if (response.ok && cookies.isKey("jwt_hp")) {
          const jwt = cookies.get("jwt_hp")!;
          const decoded: any = jwt_decode(jwt);
          const id = decoded.id;

          const resUser = await api("users/" + id);
          const data: User = await resUser.json();
          this.setRetrieved(data);
          this.setIsLoggedIn(true);
        } else {
          await this.logout(); // refresh échoué → logout
        }
      } catch (error) {
        console.error(error);
        
    this.setIsLoggedIn(false);
      }

    },
    
setIsLoggedIn(status: boolean) {
  this.isLoggedIn = status;
},



setLoading(value: boolean) {
  this.isLoading = value;
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
