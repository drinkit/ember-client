import { helper } from '@ember/component/helper';

export default helper(function localized(params, hash) {
  const { ru, en, uk } = hash;

  function getFirstSupportedLanguage() {
    let preferredLanguages = navigator.languages;
    let supportedLanguages = ['uk', 'en', 'ru'];
    for (let language of preferredLanguages) {
      if (supportedLanguages.includes(language)) {
        return language;
      }
    }
    return 'ru';
  }

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
});
