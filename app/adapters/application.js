import DS from 'ember-data';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';

export default DS.RESTAdapter.extend(DataAdapterMixin, {
    authorizer: 'authorizer:digest',
	host: 'http://prod-drunkedguru.rhcloud.com',
	namespace: 'rest',
	shouldReloadAll() { return true; }
});
