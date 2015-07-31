import DS from 'ember-data';

export default DS.RESTAdapter.extend({
	host: 'http://prod-drunkedguru.rhcloud.com',
	namespace: 'rest',
	shouldReloadAll() { return true; }
});
