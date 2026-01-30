import { useCallback } from 'react';
import { translations, TranslationKey } from './translations';

type InterpolationValues = Record<string, string | number>;

const DEFAULT_LANGUAGE = 'en';

export function useTranslation() {
  const t = useCallback(
    (key: TranslationKey, values?: InterpolationValues): string => {
      let text: string = translations[DEFAULT_LANGUAGE][key] || key;

      if (values) {
        Object.entries(values).forEach(([placeholder, value]) => {
          text = text.replace(new RegExp(`{{${placeholder}}}`, 'g'), String(value));
        });
      }

      return text;
    },
    []
  );

  return { t };
}
