'use strict';

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'ember-drink-it',
    environment: environment,
    rootURL: '/',
    locationType: 'auto',
    contentSecurityPolicy: {
      'frame-src': "'self' oauth.vk.com",
      'font-src': "'self' localhost https://fonts.gstatic.com/l/font https://aws-server.drinkit.guru",
      'style-src': "'self' 'unsafe-inline' https://fonts.googleapis.com https://aws-server.drinkit.guru",
      'script-src': "'self' 'unsafe-eval' www.google-analytics.com api.vk.com https://aws-server.drinkit.guru",
      'connect-src': "'self' https://d28tpskzrtecde.cloudfront.net https://static.78.49.203.116.clients.your-server.de http://localhost:8080 www.google-analytics.com https://aws-server.drinkit.guru https://drinkit-stg.eu-central-1.elasticbeanstalk.com/ https://server.drinkit.guru https://graph.facebook.com",
      'img-src': "'self' https://d28tpskzrtecde.cloudfront.net https://static.78.49.203.116.clients.your-server.de https://server.drinkit.guru https://s3.eu-central-1.amazonaws.com https://drinkit-stg.eu-central-1.elasticbeanstalk.com/ www.google-analytics.com data:"
    },
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. EMBER_NATIVE_DECORATOR_SUPPORT: true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    }
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
    ENV['server-path'] = 'https://static.78.49.203.116.clients.your-server.de';
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;
  }

  if (environment === 'production') {
    ENV['server-path'] = 'https://static.78.49.203.116.clients.your-server.de';//'https://aws-server.drinkit.guru';
  }

  return ENV;
};
