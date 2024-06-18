// utils/localize.js

// Define the getFirstSupportedLanguage function outside of the localize function
export function getFirstSupportedLanguage() {
  let preferredLanguages = navigator.languages;
  let supportedLanguages = ['uk', 'en', 'ru'];
  for (let language of preferredLanguages) {
    if (supportedLanguages.includes(language)) {
      return language;
    }
  }
  return 'ru';
}

export default function localize(ru, en, uk) {
  const language = getFirstSupportedLanguage();

  switch (language) {
    case 'ru':
      return ru;
    case 'en':
      return en;
    case 'uk':
      return uk;
    default:
      return ru;
  }
}
