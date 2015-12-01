export function initialize(applicationInstance) {
  var oauthio = applicationInstance.lookup('service:oauthio');
  oauthio.initialize();
}

export default {
  name: 'oauthio',
  initialize: initialize
};
