import axios, { AxiosError } from 'axios';

import type { ApiErrorBody } from './types';
import type { Language } from '../i18n/I18nContext';

const baseURL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080';

export const apiClient = axios.create({
  baseURL,
  headers: {
    Accept: 'application/json',
  },
});

export function getApiErrorMessage(error: unknown, language: Language = 'es'): string {
  if (axios.isAxiosError<ApiErrorBody>(error)) {
    const axiosError = error as AxiosError<ApiErrorBody>;
    const data = axiosError.response?.data;
    const fieldMessage = data?.fieldErrors?.[0]?.message;

    return (
      fieldMessage ??
      data?.message ??
      data?.error ??
      axiosError.message ??
      (language === 'es' ? 'No pudimos cargar la informacion solicitada.' : 'We could not load the requested information.')
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return language === 'es' ? 'No pudimos cargar la informacion solicitada.' : 'We could not load the requested information.';
}
