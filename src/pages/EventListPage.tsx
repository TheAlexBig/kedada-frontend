import { ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';
import { useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { getApiErrorMessage } from '../api/client';
import { listCategories } from '../api/events';
import { EventFilters } from '../components/events/EventFilters';
import { EventGrid } from '../components/events/EventGrid';
import { SearchForm } from '../components/events/SearchForm';
import { Button } from '../components/ui/Button';
import { EmptyState, ErrorState, LoadingState } from '../components/ui/Status';
import { useEnrichedEvents } from '../hooks/useEnrichedEvents';
import { useI18n } from '../i18n/I18nContext';

const pageSize = 9;

export function EventListPage() {
  const { language, t } = useI18n();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const q = searchParams.get('q') ?? '';
  const categoryId = searchParams.get('categoryId') ?? '';
  const priority = searchParams.get('priority') ?? '';
  const page = Number(searchParams.get('page') ?? 0);

  const params = useMemo(
    () => ({
      q,
      categoryId: categoryId || undefined,
      priority: priority ? Number(priority) : undefined,
      page,
      size: pageSize,
      sort: 'createdAt,desc',
    }),
    [categoryId, page, priority, q],
  );

  const events = useEnrichedEvents(params);
  const categories = useQuery({
    queryKey: ['categories'],
    queryFn: () => listCategories(0, 100),
  });
  const categoryData = categories.data;
  const eventData = events.data;

  function setParam(name: string, value: string) {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set(name, value);
    } else {
      next.delete(name);
    }
    next.set('page', '0');
    navigate(`/eventos?${next.toString()}`);
  }

  function setPage(nextPage: number) {
    const next = new URLSearchParams(searchParams);
    next.set('page', String(nextPage));
    navigate(`/eventos?${next.toString()}`);
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase text-rose-700">{t('Agenda')}</p>
        <h1 className="mt-2 text-3xl font-black text-stone-950 sm:text-4xl">
          {t('Eventos en El Salvador')}
        </h1>
        <p className="mt-3 max-w-2xl text-stone-600">
          {t('Busca eventos publicados y filtra solo con opciones disponibles en la API.')}
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
        <aside className="space-y-4">
          <div className="rounded-lg border border-stone-200 bg-white p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-stone-900">
              <SlidersHorizontal className="h-4 w-4" />
              {t('Buscar')}
            </div>
            <SearchForm initialValue={q} onSearch={(value) => setParam('q', value)} />
          </div>

          {categories.isLoading ? (
            <LoadingState label={t('Cargando categorias...')} />
          ) : categories.isError ? (
            <ErrorState message={getApiErrorMessage(categories.error, language)} />
          ) : (
            <EventFilters
              categories={categoryData?.content ?? []}
              categoryId={categoryId}
              onCategoryChange={(value) => setParam('categoryId', value)}
            />
          )}
        </aside>

        <div>
          {events.isLoading ? (
            <LoadingState />
          ) : events.isError ? (
            <ErrorState message={getApiErrorMessage(events.error, language)} />
          ) : !eventData || eventData.content.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              <div className="mb-4 flex items-center justify-between text-sm text-stone-600">
                <span>{t('{count} eventos encontrados', { count: eventData.totalElements })}</span>
                <span>
                  {t('Pagina {page} de {total}', { page: eventData.number + 1, total: Math.max(eventData.totalPages, 1) })}
                </span>
              </div>
              <EventGrid events={eventData.content} constrained />
              <div className="mt-8 flex items-center justify-center gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  disabled={eventData.first}
                  onClick={() => setPage(Math.max(eventData.number - 1, 0))}
                >
                  <ChevronLeft className="h-4 w-4" />
                  {t('Anterior')}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  disabled={eventData.last}
                  onClick={() => setPage(eventData.number + 1)}
                >
                  {t('Siguiente')}
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
