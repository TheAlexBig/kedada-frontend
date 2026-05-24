import { ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { EventGrid } from '../components/events/EventGrid';
import { SearchForm } from '../components/events/SearchForm';
import { ButtonLink } from '../components/ui/Button';
import { EmptyState, ErrorState, LoadingState } from '../components/ui/Status';
import { useEnrichedEvents } from '../hooks/useEnrichedEvents';
import { getApiErrorMessage } from '../api/client';

export function HomePage() {
  const navigate = useNavigate();
  const recentEvents = useEnrichedEvents({
    page: 0,
    size: 6,
    sort: 'createdAt,desc',
  });
  const featuredEvents = useEnrichedEvents({
    page: 0,
    size: 3,
    priority: 1,
    sort: 'priority,asc',
  });
  const featuredData = featuredEvents.data;
  const recentData = recentEvents.data;

  return (
    <>
      <section className="bg-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.1fr_0.9fr] md:py-20 lg:px-8">
          <div className="flex flex-col justify-center">
            <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-md bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-900">
              <Sparkles className="h-4 w-4" />
              Agenda viva de El Salvador
            </div>
            <h1 className="max-w-3xl text-4xl font-black leading-tight text-stone-950 sm:text-5xl">
              Descubri la proxima kedada sin perderte en mil publicaciones.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-stone-600">
              Eventos, actividades culturales, conciertos y planes locales en un
              lugar rapido de explorar y facil de compartir.
            </p>
            <div className="mt-8 max-w-2xl">
              <SearchForm
                onSearch={(value) =>
                  navigate(value ? `/eventos?q=${encodeURIComponent(value)}` : '/eventos')
                }
              />
            </div>
            <div className="mt-6">
              <ButtonLink to="/eventos">
                Explorar eventos
                <ArrowRight className="h-4 w-4" />
              </ButtonLink>
            </div>
          </div>

          <div className="min-h-72 overflow-hidden rounded-lg border border-stone-200 bg-stone-950 p-6 text-white shadow-sm">
            <div className="flex h-full flex-col justify-between gap-12">
              <div>
                <p className="text-sm font-semibold text-rose-200">Hoy en Kedada</p>
                <p className="mt-4 text-3xl font-black leading-tight">
                  Busca por nombre, revisa el precio y salta directo al sitio oficial.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {['Musica', 'Cultura', 'Ferias'].map((label) => (
                  <div key={label} className="rounded-md bg-white/10 p-3 text-sm font-semibold">
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase text-rose-700">Recomendados</p>
            <h2 className="mt-1 text-2xl font-black text-stone-950">Eventos destacados</h2>
          </div>
          <ButtonLink to="/eventos?priority=1" variant="secondary">
            Ver todos
          </ButtonLink>
        </div>
        {featuredEvents.isLoading ? (
          <LoadingState label="Cargando eventos destacados..." />
        ) : featuredEvents.isError ? (
          <ErrorState message={getApiErrorMessage(featuredEvents.error)} />
        ) : !featuredData || featuredData.content.length === 0 ? (
          <EmptyState description="Aun no hay eventos destacados publicados." />
        ) : (
          <EventGrid events={featuredData.content} />
        )}
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase text-teal-700">Recientes</p>
            <h2 className="mt-1 text-2xl font-black text-stone-950">Ultimas publicaciones</h2>
          </div>
          <ButtonLink to="/eventos" variant="secondary">
            Abrir agenda
          </ButtonLink>
        </div>
        {recentEvents.isLoading ? (
          <LoadingState />
        ) : recentEvents.isError ? (
          <ErrorState message={getApiErrorMessage(recentEvents.error)} />
        ) : !recentData || recentData.content.length === 0 ? (
          <EmptyState description="Cuando haya eventos publicados, apareceran aqui." />
        ) : (
          <EventGrid events={recentData.content} />
        )}
      </section>
    </>
  );
}
