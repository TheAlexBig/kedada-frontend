import { useI18n } from './I18nContext';

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useI18n();

  return (
    <select
      aria-label={t('Idioma')}
      className="h-10 rounded-md border border-stone-300 bg-white px-2 text-sm font-semibold text-stone-700"
      value={language}
      onChange={(event) => setLanguage(event.target.value as 'es' | 'en')}
    >
      <option value="es">{t('Español')}</option>
      <option value="en">{t('Ingles')}</option>
    </select>
  );
}
