import qs from "qs";
import type { SubmissionErrors } from "../types/error";
import { SubmissionError } from "./error";

const MIME_TYPE = "application/ld+json";
const ENTRYPOINT = import.meta.env.VITE_ENTRYPOINT;


async function refreshToken() {
  const response = await fetch(new URL("token/refresh", ENTRYPOINT), {
    method: "POST",
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Refresh token failed");
  }
}

export default async function api(id: string, options: any = {}, retry = true): Promise<Response> {
  // 🧩 Étape 1 : Toujours initialiser options
  if (!options) options = {};

  // 🧩 Étape 2 : Toujours initialiser headers
  let headers: Headers;

  if (options.headers instanceof Headers) {
    headers = options.headers;
  } else if (typeof options.headers === "object" && options.headers !== null) {
    headers = new Headers();
    for (const [key, value] of Object.entries(options.headers)) {
      headers.set(key, value as string);
    }
  } else {
    headers = new Headers();
  }

  // 🧩 Étape 3 : Ajouter les headers par défaut si absents
  if (!headers.has("Accept")) {
    headers.set("Accept", MIME_TYPE);
  }

  if (
    options.body !== undefined &&
    !(options.body instanceof FormData) &&
    !headers.has("Content-Type")
  ) {
    headers.set("Content-Type", MIME_TYPE);
  }

  // 🧩 Étape 4 : Gérer les paramètres GET si présents
  if (options.params) {
    const queryString = qs.stringify(options.params);
    id = `${id}?${queryString}`;
  }

  // 🧩 Étape 5 : Fusion finale
  options.headers = headers;
  options.mode = "cors";
  options.credentials = "include";

  // 🧩 Étape 6 : Appel API
  const response = await fetch(new URL(id, ENTRYPOINT), options);

  // 🧩 Étape 7 : Gestion des erreurs Hydra
  if (!response.ok) {

    if (response.status === 401 && retry) {
      try {
        await refreshToken();
        return api(id, options, false); // passe false pour ne pas boucler
      }     catch (err) {
        // refresh échoué
    }
}
    let data: any = {};
    try {
      data = await response.json();
    } catch {
      throw new Error(response.statusText);
    }

    const error = data["hydra:description"] || response.statusText;
    if (!data.violations) throw new Error(error);

    const errors: SubmissionErrors = { _error: error };
    data.violations.forEach(
      (violation: { propertyPath: string; message: string }) => {
        errors[violation.propertyPath] = violation.message;
      }
    );

    throw new SubmissionError(errors);
  }

  return response;
}
