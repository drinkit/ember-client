export function initialize(applicationInstance) {
  var oauth = applicationInstance.lookup('service:oauth');
  oauth.initialize();
}

export default {
  name: 'hellojs',
  initialize
};
