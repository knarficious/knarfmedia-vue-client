import qs from "qs";
import type { SubmissionErrors } from "../types/error";
import { SubmissionError } from "./error";
const ENTRYPOINT = import.meta.env.VITE_ENTRYPOINT;

export default async function apiFormData(id: string, options: any = {}) {

    if (options.params) {
    const queryString = qs.stringify(options.params);
    id = `${id}?${queryString}`;
  }

  // enable CORS for all requests
  Object.assign(options, {
    mode: "cors",
    credentials: 'include', // when credentials needed
  });

  const response = await fetch(new URL(id, ENTRYPOINT), options);

  // Handle 201 No Content (common for file updates) as success
  if (response.status === 201) {
    return null; // or { success: true }, whatever your app expects
  }

  let bodyText: string;
  try {
    bodyText = await response.text(); // safe: never throws
  } catch (err: any) {
    throw new Error(`Failed to read response body: ${err.message}`);
  }

  if (!response.ok) {
    let errorData = null;
    let errorMessage = response.statusText || 'Request failed';

    if (bodyText.trim().length > 0) {
      try {
        errorData = JSON.parse(bodyText);
        errorMessage = errorData['hydra:description'] 
                    || errorData.detail 
                    || errorData.message 
                    || errorMessage;
      } catch (parseErr) {
        // Not JSON → log raw text (might be HTML, plain text error, empty)
        console.warn('Non-JSON error response:', bodyText.substring(0, 300));
        errorMessage = `Server error (${response.status}): ${bodyText.substring(0, 150)}...`;
      }
    } else {
      // Empty body on error → very common
      errorMessage = `Server error (${response.status}): No details provided (empty response body)`;
    }

    if (errorData?.violations) {
      const errors: SubmissionErrors = { _error: errorMessage };
      errorData.violations.forEach((violation: { propertyPath: string; message: string }) => {
        errors[violation.propertyPath] = violation.message;
      });
      throw new SubmissionError(errors);
    }

    throw new Error(errorMessage);
  }

  // Success with body → parse JSON
  if (bodyText.trim().length > 0) {
    return JSON.parse(bodyText);
  }

  return null; // or response if you need headers/status
}