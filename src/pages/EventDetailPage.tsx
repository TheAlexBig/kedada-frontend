import { useEffect, useState } from 'react';
import { ArrowLeft, CalendarDays, ExternalLink, Share2, Tag } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

import { getApiErrorMessage } from '../api/client';
import { recordEventShare, recordEventView } from '../api/events';
import { Button, ButtonLink } from '../components/ui/Button';
import { ErrorState, LoadingState } from '../components/ui/Status';
import { useEventDetail } from '../hooks/useEventDetail';
import { formatCurrency, formatDate, formatDateRange } from '../utils/format';
import { useI18n } from '../i18n/I18nContext';

export function EventDetailPage() {
  const { id } = useParams();
  const { language, t } = useI18n();
  const detail = useEventDetail(id);
  const { data, refetch } = detail;
  const [shareMessage, setShareMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!id || !data || wasViewedToday(id)) {
      return;
    }

    markViewedToday(id);
    void recordEventView(id).then(() => refetch()).catch(() => undefined);
  }, [data, id, refetch]);

  async function handleShare() {
    if (!id || !detail.data) {
      return;
    }

    try {
      const url = window.location.href;
      if (navigator.share) {
        await navigator.share({ title: detail.data.event.title, url });
      } else {
        await navigator.clipboard.writeText(url);
      }
      await recordEventShare(id);
      setShareMessage(t('Enlace compartido.'));
      void detail.refetch();
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return;
      }
      setShareMessage(t('No se pudo compartir el enlace.'));
    }
  }

  if (detail.isLoading) {
    return (
      <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <LoadingState label={t('Cargando detalle del evento...')} />
      </section>
    );
  }

  if (detail.isError) {
    return (
      <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <ErrorState message={getApiErrorMessage(detail.error, language)} />
      </section>
    );
  }

  if (!detail.data) {
    return null;
  }

  const { event, metrics } = detail.data;
  const schedules = event.schedules ?? [];
  const urls = event.urls ?? [];

  return (
    <article>
      <div className="bg-white">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <Link
            to="/eventos"
            className="inline-flex items-center gap-2 text-sm font-semibold text-stone-600 hover:text-rose-700"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('Volver a eventos')}
          </Link>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
            <div>
              <div className="flex flex-wrap gap-2">
                {event.categories?.map((category) => (
                  <span key={category.id} className="inline-flex items-center gap-1 rounded-md bg-teal-50 px-3 py-1 text-sm font-semibold text-teal-800">
                    <Tag className="h-4 w-4" />
                    {category.name}
                  </span>
                ))}
              </div>

              <h1 className="mt-5 text-4xl font-black leading-tight text-stone-950 sm:text-5xl">
                {event.title}
              </h1>
              <p className="mt-5 whitespace-pre-line text-lg leading-8 text-stone-700">
                {event.description || t('Sin descripcion disponible.')}
              </p>
            </div>

            <aside className="h-fit rounded-lg border border-stone-200 bg-stone-50 p-5">
              <dl className="space-y-4 text-sm">
                <div>
                  <dt className="font-semibold text-stone-500">{t('Precio')}</dt>
                  <dd className="mt-1 text-lg font-black text-stone-950">
                    {formatCurrency(event.price, language)}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-stone-500">{t('Fecha')}</dt>
                  <dd className="mt-1 text-stone-900">
                    {schedules[0]
                      ? formatDateRange(schedules[0].startDate, schedules[0].endDate, language)
                      : t('Fecha no publicada')}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-stone-500">{t('Publicado')}</dt>
                  <dd className="mt-1 text-stone-900">{formatDate(event.createdAt, language)}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-stone-500">{t('Actualizado')}</dt>
                  <dd className="mt-1 text-stone-900">{formatDate(event.updatedAt, language)}</dd>
                </div>
                {metrics && (
                  <div>
                    <dt className="font-semibold text-stone-500">{t('Interaccion')}</dt>
                    <dd className="mt-1 text-stone-900">
                      {t('{views} vistas · {shares} compartidos', { views: metrics.views, shares: metrics.shares })}
                    </dd>
                  </div>
                )}
              </dl>

              <div className="mt-6 grid gap-3">
                <Button type="button" variant="secondary" onClick={() => void handleShare()}>
                  <Share2 className="h-4 w-4" />
                  {t('Compartir evento')}
                </Button>
                {shareMessage && <p className="text-sm text-stone-600">{shareMessage}</p>}
                {urls.map((url, index) => (
                  <a
                    key={url.id}
                    href={url.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex h-11 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold transition ${
                      index === 0
                        ? 'bg-rose-600 text-white hover:bg-rose-700'
                        : 'border border-stone-300 bg-white text-stone-900 hover:border-rose-300 hover:text-rose-700'
                    }`}
                  >
                    {url.description || url.kind || t('Enlace externo')}
                    <ExternalLink className="h-4 w-4" />
                  </a>
                ))}
                {urls.length === 0 && (
                  <p className="rounded-md bg-white p-3 text-sm text-stone-600">
                    {t('Este evento aun no tiene enlaces externos publicados.')}
                  </p>
                )}
              </div>
            </aside>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-lg border border-stone-200 bg-white">
          <div className="aspect-[16/7] bg-gradient-to-br from-rose-100 via-amber-100 to-teal-100">
            {event.thumbnailUrl ? (
              <img className="h-full w-full object-cover" src={event.thumbnailUrl} alt={event.title} />
            ) : (
              <div className="flex h-full items-center justify-center text-xl font-black text-stone-700">
                Kedada
              </div>
            )}
          </div>
        </div>

        <section className="mt-8 rounded-lg border border-stone-200 bg-white p-5">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-rose-600" />
            <h2 className="text-xl font-black text-stone-950">{t('Horarios')}</h2>
          </div>

          {schedules.length > 0 ? (
            <ol className="mt-4 divide-y divide-stone-200">
              {schedules.map((schedule) => (
                <li key={schedule.id} className="py-4 first:pt-0 last:pb-0">
                  <p className="font-semibold text-stone-950">
                    {formatDateRange(schedule.startDate, schedule.endDate, language)}
                  </p>
                  <p className="mt-1 text-sm text-stone-500">
                    {schedule.endDate ? t('Inicio y finalizacion') : t('Fecha de inicio')}
                  </p>
                </li>
              ))}
            </ol>
          ) : (
            <p className="mt-4 rounded-md bg-stone-50 p-4 text-sm text-stone-600">
              {t('Este evento aun no tiene horarios publicados.')}
            </p>
          )}
        </section>

        <div className="mt-8 rounded-lg border border-stone-200 bg-white p-5">
          <h2 className="text-xl font-black text-stone-950">{t('Metadatos')}</h2>
          <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
            <div>
              <dt className="font-semibold text-stone-500">{t('ID del evento')}</dt>
              <dd className="mt-1 break-all text-stone-900">{event.id}</dd>
            </div>
            <div>
              <dt className="font-semibold text-stone-500">{t('IDs de categorias')}</dt>
              <dd className="mt-1 break-all text-stone-900">{event.categoryIds.join(', ')}</dd>
            </div>
            <div>
              <dt className="font-semibold text-stone-500">{t('Enlaces publicados')}</dt>
              <dd className="mt-1 text-stone-900">{urls.length}</dd>
            </div>
          </dl>
        </div>

        <div className="mt-8">
          <ButtonLink to="/eventos" variant="secondary">
            <Share2 className="h-4 w-4" />
            {t('Seguir explorando')}
          </ButtonLink>
        </div>
      </div>
    </article>
  );
}

function wasViewedToday(eventId: string) {
  return window.localStorage.getItem(`kedada_view_${eventId}`) === new Date().toISOString().slice(0, 10);
}

function markViewedToday(eventId: string) {
  window.localStorage.setItem(`kedada_view_${eventId}`, new Date().toISOString().slice(0, 10));
}
