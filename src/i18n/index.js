import * as translations from './translations';

class I18nService {
  constructor(services, config = {}) {
    this.services = services;
    this.config = config;
    this._currentLang = localStorage.getItem('selectedLanguage') || config.defaultLang || 'ru';
    this.subscribers = new Set();
    setTimeout(() => {
      this.services.api.setHeader('X-Lang', this._currentLang);
    }, 0);
  }

  get currentLang() {
    return this._currentLang;
  }

  translate(key, options = {}, lang = this._currentLang) {
    const langTranslations = translations[lang] || {};
    let result = langTranslations[key] || key;

    // Если передан `count`, обрабатываем плюрализацию
    if (typeof options.count !== 'undefined') {
      if (typeof result === 'object') {
        // Проверяем, что результат — объект с формами
        const pluralKey = new Intl.PluralRules(lang).select(options.count);
        if (pluralKey in result) {
          result = result[pluralKey];
        }
      }
    }

    return result;
  }

  setLang(lang) {
    if (lang !== this._currentLang) {
      this._currentLang = lang;
      localStorage.setItem('selectedLanguage', lang);
      this.notifySubscribers();
      this.services.api.setHeader('X-Lang', lang);
    }
  }

  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  notifySubscribers() {
    this.subscribers.forEach(callback => callback());
  }
}

export default I18nService;
