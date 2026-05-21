import axios, { AxiosError } from 'axios';

import type { ApiErrorBody } from './types';

const baseURL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080';

export const apiClient = axios.create({
  baseURL,
  headers: {
    Accept: 'application/json',
  },
});

export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ApiErrorBody>(error)) {
    const axiosError = error as AxiosError<ApiErrorBody>;
    const data = axiosError.response?.data;
    const fieldMessage = data?.fieldErrors?.[0]?.message;

    return (
      fieldMessage ??
      data?.message ??
      data?.error ??
      axiosError.message ??
      'No pudimos cargar la informacion solicitada.'
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'No pudimos cargar la informacion solicitada.';
}
