import DS from 'ember-data';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
import ENV from 'ember-drink-it/config/environment';

export default DS.RESTAdapter.extend(DataAdapterMixin, {
  authorizer: 'authorizer:digest',
  host: ENV['server-path'],
  namespace: 'rest',
  shouldReloadAll() {
    return true;
  },

  ajaxOptions() {
    const authorizer = this.get('authorizer');

    let hash = this._super(...arguments);
    let {
      beforeSend
    } = hash;

    hash.beforeSend = (xhr) => {
      if (beforeSend) {
        beforeSend(xhr);
      }

      this.get('session').authorize(authorizer, (headerName, headerValues) => {
        xhr.setRequestHeader(headerName, headerValues[hash.type]);
      });
    };
    return hash;
  }
});
