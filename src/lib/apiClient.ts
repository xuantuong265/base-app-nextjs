"use client";

import axios, {
  AxiosInstance,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

interface Auth {
  accessToken: string;
}

interface RefreshTokenResponse {
  accessToken: string;
}

class AxiosClient {
  private isRefreshing: boolean;
  private refreshSubscribers: Array<(newAccessToken: string) => void>;
  private auth: Auth | null;
  private accessToken: string | null;
  private axiosCustom: AxiosInstance;

  constructor() {
    this.isRefreshing = false;
    this.refreshSubscribers = [];
    this.auth = this.getStoredAuth();
    this.accessToken = this.auth?.accessToken ?? null;
    this.axiosCustom = this.createAxiosInstance();
  }

  private getStoredAuth(): Auth | null {
    try {
      const storedAuth = localStorage.getItem("auth");
      return storedAuth ? JSON.parse(storedAuth) : null;
    } catch (error) {
      console.error("Failed to parse stored auth:", error);
      return null;
    }
  }

  private createAxiosInstance(): AxiosInstance {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    if (this.accessToken) {
      headers["Authorization"] = `Bearer ${this.accessToken}`;
    }

    const axiosInstance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      headers,
      withCredentials: true, // Enable sending cookies with requests
    });

    axiosInstance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        return config;
      },
      (error: Error) => {
        console.error("Request error:", error);
        return Promise.reject(error);
      }
    );

    axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        return response.data;
      },
      async (error: AxiosError) => {
        const errResponse = error.response;

        if (errResponse) {
          switch (errResponse.status) {
            case 400:
              console.error(
                "Bad Request: The request was invalid or cannot be processed."
              );
              break;
            case 401:
              // Token is expired or invalid
              if (this.isRefreshing) {
                return new Promise<unknown>((resolve) => {
                  this.addRefreshSubscriber((newAccessToken: string) => {
                    if (error.config) {
                      error.config.headers["Authorization"] =
                        `Bearer ${newAccessToken}`;
                      resolve(axios(error.config));
                    }
                  });
                });
              }

              this.isRefreshing = true;

              try {
                // The refresh token will be automatically included in cookies
                const refreshResponse = await axios.post<RefreshTokenResponse>(
                  `${process.env.NEXT_PUBLIC_API_URL}/refresh-token`,
                  {}, // Empty body since refresh token is in cookies
                  {
                    withCredentials: true, // Ensure cookies are sent with the request
                  }
                );

                const newAccessToken = refreshResponse.data?.accessToken;

                // Store only the access token
                const updatedAuth = { accessToken: newAccessToken };
                localStorage.setItem("auth", JSON.stringify(updatedAuth));

                this.onAccessTokenFetched(newAccessToken);

                if (error.config) {
                  error.config.headers["Authorization"] =
                    `Bearer ${newAccessToken}`;
                }
                this.isRefreshing = false;

                return error.config
                  ? axios(error.config)
                  : Promise.reject(error);
              } catch (refreshError) {
                this.handleAuthError();
                return Promise.reject(refreshError);
              }
            case 403:
              console.error(
                "Forbidden: You do not have permission to access this resource."
              );
              break;
            case 500:
              console.error(
                "Server Error: Something went wrong on the server."
              );
              break;
            default:
              console.error(`Unexpected error: ${errResponse.status}`);
              break;
          }
        } else {
          console.error("Network or unknown error:", error);
        }

        return Promise.reject(error);
      }
    );

    return axiosInstance;
  }

  private handleAuthError(): void {
    localStorage.removeItem("auth");
    //window.location.reload();
  }

  private onAccessTokenFetched(newAccessToken: string): void {
    this.refreshSubscribers.forEach((callback) => callback(newAccessToken));
    this.refreshSubscribers = [];
  }

  private addRefreshSubscriber(
    callback: (newAccessToken: string) => void
  ): void {
    this.refreshSubscribers.push(callback);
  }

  public getAxiosInstance(): AxiosInstance {
    return this.axiosCustom;
  }
}

export default AxiosClient;
