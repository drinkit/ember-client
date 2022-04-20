export function initialize(applicationInstance) {
  const oauth = applicationInstance.lookup('service:oauth');
  oauth.initialize();
}

export default {
  name: 'hellojs',
  initialize
};
