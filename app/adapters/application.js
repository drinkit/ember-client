import DS from 'ember-data';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';

export default DS.RESTAdapter.extend(DataAdapterMixin, {
    authorizer: 'authorizer:digest',
	host: 'http://prod-drunkedguru.rhcloud.com',
	namespace: 'rest',
	shouldReloadAll() { return true; },
    
    ajaxOptions() {
        const authorizer = this.get('authorizer');

        let hash = this._super(...arguments);
        let { beforeSend } = hash;
        
        hash.beforeSend = (xhr) => {
          this.get('session').authorize(authorizer, (headerName, headerValues) => {
            xhr.setRequestHeader(headerName, headerValues[hash.type]);
          });
          if (beforeSend) {
            beforeSend(xhr);
          }
        };
        return hash;
      }
});
