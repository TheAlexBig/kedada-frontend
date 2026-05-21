import { apiClient } from './client';
import type {
  CategoryResponse,
  EventMetricSummaryResponse,
  EventResponse,
  EventSearchParams,
  PageResponse,
  ScheduleResponse,
  UrlResponse,
  UUID,
} from './types';

function compactParams(params: object) {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== ''),
  );
}

export async function listEvents(params: EventSearchParams = {}) {
  const response = await apiClient.get<PageResponse<EventResponse>>('/api/v1/events', {
    params: compactParams(params),
  });

  return response.data;
}

export async function getEvent(id: UUID) {
  const response = await apiClient.get<EventResponse>(`/api/v1/events/${id}`);
  return response.data;
}

export async function listCategories(page = 0, size = 100) {
  const response = await apiClient.get<PageResponse<CategoryResponse>>(
    '/api/v1/categories',
    {
      params: { page, size, sort: 'name,asc' },
    },
  );

  return response.data;
}

export async function getCategory(id: UUID) {
  const response = await apiClient.get<CategoryResponse>(`/api/v1/categories/${id}`);
  return response.data;
}

export async function getUrl(id: UUID) {
  const response = await apiClient.get<UrlResponse>(`/api/v1/urls/${id}`);
  return response.data;
}

export async function listSchedules(page = 0, size = 100) {
  const response = await apiClient.get<PageResponse<ScheduleResponse>>(
    '/api/v1/schedules',
    {
      params: { page, size, sort: 'startDate,asc' },
    },
  );

  return response.data;
}

export async function listSchedulesForEvent(eventId: UUID) {
  const schedules: ScheduleResponse[] = [];
  let page = 0;
  let last = false;

  while (!last) {
    const response = await listSchedules(page, 100);
    schedules.push(...response.content.filter((schedule) => schedule.eventId === eventId));
    last = response.last;
    page += 1;
  }

  return schedules;
}

export async function getEventMetricSummary(id: UUID) {
  const response = await apiClient.get<EventMetricSummaryResponse>(
    `/api/v1/events/${id}/metrics/summary`,
  );
  return response.data;
}
