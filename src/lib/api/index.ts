import axios, { type AxiosError, type AxiosInstance } from "axios";
import { ErrorResponse } from "./types";

const HEADERS = {
  Accept: "application/json",
};

class FPApiClass {
  public axios: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    headers: HEADERS,
  });

  public configre() {
    this.axios.interceptors.response.use(
      async (response) => {
        const result: ErrorResponse | Record<string, unknown> = response.data;

        const hasError =
          result &&
          typeof result === "object" &&
          "statusCode" in result &&
          result.statusCode !== 0;

        if (hasError) {
          return Promise.reject(result.message);
        }

        return response;
      },
      async (error) => {
        if (error && !!error.isAxiosError) {
          const err = error as AxiosError<
            ErrorResponse | Record<string, unknown>
          >;
          return Promise.reject(err.response?.data);
        }

        return Promise.reject(error);
      }
    );
  }
}

export const FPApi = new FPApiClass();
