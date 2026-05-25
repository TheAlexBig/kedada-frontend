import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export type Language = 'es' | 'en';
type Values = Record<string, string | number>;
type Translate = (text: string, values?: Values) => string;

const storageKey = 'kedada_language';

const english: Record<string, string> = {
  Inicio: 'Home',
  Eventos: 'Events',
  Idioma: 'Language',
  'Español': 'Spanish',
  Ingles: 'English',
  'Abrir menu': 'Open menu',
  'Cerrar menu': 'Close menu',
  'Kedada. Eventos y descubrimientos en El Salvador.': 'Kedada. Events and discoveries in El Salvador.',
  'Hecho para explorar rapido, leer claro y salir a tiempo.': 'Made to explore quickly, read clearly, and get there on time.',
  'Cargando eventos...': 'Loading events...',
  'Algo salio mal': 'Something went wrong',
  'No encontramos eventos': 'No events found',
  'Proba con otra busqueda o volve mas tarde.': 'Try another search or come back later.',
  'Buscar eventos': 'Search events',
  'Busca conciertos, ferias, teatro...': 'Search concerts, fairs, theater...',
  Buscar: 'Search',
  Categoria: 'Category',
  'Todas las categorias': 'All categories',
  'Imagen registrada: {id}': 'Registered image: {id}',
  'Publicado {date}': 'Published {date}',
  'Ver detalle': 'View details',
  'Sitio oficial': 'Official site',
  'Agenda viva de El Salvador': 'El Salvador live agenda',
  'Descubri la proxima kedada sin perderte en mil publicaciones.': 'Discover your next get-together without getting lost in endless posts.',
  'Eventos, actividades culturales, conciertos y planes locales en un lugar rapido de explorar y facil de compartir.': 'Events, cultural activities, concerts, and local plans in one place that is easy to explore and share.',
  'Explorar eventos': 'Explore events',
  'Hoy en Kedada': 'Today on Kedada',
  'Busca por nombre, revisa el precio y salta directo al sitio oficial.': 'Search by name, check the price, and jump directly to the official site.',
  Musica: 'Music',
  Cultura: 'Culture',
  Ferias: 'Fairs',
  Recomendados: 'Recommended',
  'Eventos destacados': 'Featured events',
  'Ver todos': 'View all',
  'Cargando eventos destacados...': 'Loading featured events...',
  'Aun no hay eventos destacados publicados.': 'There are no featured events published yet.',
  Recientes: 'Recent',
  'Ultimas publicaciones': 'Latest listings',
  'Abrir agenda': 'Open agenda',
  'Cuando haya eventos publicados, apareceran aqui.': 'Published events will appear here.',
  Agenda: 'Agenda',
  'Eventos en El Salvador': 'Events in El Salvador',
  'Busca eventos publicados y filtra solo con opciones disponibles en la API.': 'Search published events and filter using available API options.',
  'Cargando categorias...': 'Loading categories...',
  '{count} eventos encontrados': '{count} events found',
  'Pagina {page} de {total}': 'Page {page} of {total}',
  Anterior: 'Previous',
  Siguiente: 'Next',
  'Cargando detalle del evento...': 'Loading event details...',
  'Volver a eventos': 'Back to events',
  'Sin descripcion disponible.': 'No description available.',
  Precio: 'Price',
  Fecha: 'Date',
  'Fecha no publicada': 'Date not published',
  Publicado: 'Published',
  Actualizado: 'Updated',
  Interaccion: 'Engagement',
  '{views} vistas · {shares} compartidos': '{views} views · {shares} shares',
  'Compartir evento': 'Share event',
  'Enlace compartido.': 'Link shared.',
  'No se pudo compartir el enlace.': 'The link could not be shared.',
  'Enlace externo': 'External link',
  'Este evento aun no tiene enlaces externos publicados.': 'This event does not have published external links yet.',
  'Thumbnail registrado con UUID {id}': 'Thumbnail registered with UUID {id}',
  Horarios: 'Schedules',
  'Inicio y finalizacion': 'Start and end',
  'Fecha de inicio': 'Start date',
  'Este evento aun no tiene horarios publicados.': 'This event does not have published schedules yet.',
  Metadatos: 'Metadata',
  'ID del evento': 'Event ID',
  'IDs de categorias': 'Category IDs',
  'Enlaces publicados': 'Published links',
  'Seguir explorando': 'Keep exploring',
  'Pagina no encontrada': 'Page not found',
  'Esta ruta no existe o el evento que buscabas ya no esta disponible.': 'This route does not exist or the event you were looking for is no longer available.',
};

const I18nContext = createContext<{
  language: Language;
  setLanguage: (language: Language) => void;
  t: Translate;
} | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const stored = window.localStorage.getItem(storageKey);
    return stored === 'en' ? 'en' : 'es';
  });

  useEffect(() => {
    window.localStorage.setItem(storageKey, language);
    document.documentElement.lang = language;
  }, [language]);

  const value = useMemo(() => ({
    language,
    setLanguage,
    t(text: string, values?: Values) {
      const translation = language === 'en' ? english[text] ?? text : text;
      return Object.entries(values ?? {}).reduce(
        (result, [key, item]) => result.replaceAll(`{${key}}`, String(item)),
        translation,
      );
    },
  }), [language]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used inside I18nProvider');
  }
  return context;
}
