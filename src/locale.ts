import type { Locale } from "date-fns";
import * as locales from "date-fns/locale";

interface Locales {
  [locale: string]: Locale | undefined;
}

export const getLocale = (languages: Readonly<string[]>): Locale => {
  // eslint-disable-next-line no-restricted-syntax
  for (const lang of languages) {
    // e.g. en-US -> enUS
    const localeId = lang.replace("-", "");
    const locale = (locales as Locales)[localeId];
    if (locale) {
      return locale;
    }
  }

  return locales.enUS;
};

export const defaultLocale = getLocale(window.navigator.languages);
