import axios, { type AxiosRequestConfig } from "axios";
import type { ApiResponse } from "./types";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

export async function apiRequest<T>(
  endpoint: string,
  config: AxiosRequestConfig = {},
  token?: string | null
): Promise<T> {
  const headers = {
    ...(config.headers as Record<string, string> | undefined),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await axiosClient.request<ApiResponse<T>>({
    url: endpoint,
    ...config,
    headers,
  });

  const payload = response.data;

  if (!payload.success) {
    const details =
      payload.errors && typeof payload.errors === "object"
        ? Object.values(payload.errors).join(", ")
        : "";
    throw new Error(
      details ? `${payload.message}: ${details}` : payload.message || "Request failed"
    );
  }

  return payload.data;
}
