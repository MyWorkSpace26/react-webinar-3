const isProduction = process.env.NODE_ENV === 'production';

/**
 * Настройки сервисов
 */
const config = {
  store: {
    // Логировать установку состояния?
    log: !isProduction,
    // Настройки модулей состояния
    modules: {
      session: {
        // Названия токена в АПИ
        tokenHeader: 'X-Token',
      },
    },
  },
  api: {
    baseUrl: process.env.NODE_ENV === 'production' ? '/api' : 'http://query.rest',
  },
  i18n: {
    defaultLang: 'ru',
    supportedLangs: ['ru', 'en'],
  },
};

export default config;
