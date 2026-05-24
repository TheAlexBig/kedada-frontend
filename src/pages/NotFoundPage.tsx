import { ButtonLink } from '../components/ui/Button';
import { useI18n } from '../i18n/I18nContext';

export function NotFoundPage() {
  const { t } = useI18n();
  return (
    <section className="mx-auto grid min-h-[60vh] max-w-3xl place-items-center px-4 py-16 text-center sm:px-6 lg:px-8">
      <div>
        <p className="text-sm font-semibold uppercase text-rose-700">404</p>
        <h1 className="mt-2 text-4xl font-black text-stone-950">{t('Pagina no encontrada')}</h1>
        <p className="mt-4 text-stone-600">
          {t('Esta ruta no existe o el evento que buscabas ya no esta disponible.')}
        </p>
        <div className="mt-8">
          <ButtonLink to="/eventos">{t('Explorar eventos')}</ButtonLink>
        </div>
      </div>
    </section>
  );
}
