/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'ember-drink-it',
    environment: environment,
    baseURL: '/',
    locationType: 'auto',
    contentSecurityPolicy: {
      'font-src': "'self'",
      'style-src': "'self' 'unsafe-inline'",
      'script-src': "'self' www.google-analytics.com",
      'connect-src': "'self' http://localhost:8080 www.google-analytics.com http://server-drunkedguru.rhcloud.com https://prod-drunkedguru.rhcloud.com https://oauth.io",
      'img-src': "'self' https://prod-drunkedguru.rhcloud.com http://server-drunkedguru.rhcloud.com www.google-analytics.com"
    },
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    }
  };

  ENV['moment'] = {
    includeLocales: ['ru', 'en']
  };

  ENV['simple-auth'] = {
    authorizer: 'authorizer:digest',
    crossOriginWhitelist: ['*']
  };

  ENV['metricsAdapters'] = [
    {
        name: 'GoogleAnalytics',
        environments: ['production'],
        config: {
          id: 'UA-62127609-2'
        }
      }
  ];

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
    ENV['server-path'] = 'https://server-drunkedguru.rhcloud.com';
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.baseURL = '/';
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {
    ENV['server-path'] = 'https://prod-drunkedguru.rhcloud.com';
  }

  return ENV;
};
