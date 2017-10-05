import Ember from 'ember';

export default Ember.Service.extend({
  simpleStore: Ember.inject.service(),
  ajax: Ember.inject.service(),

  find(modelName, ajaxBody, minSize=1) {
    const ajax = this.get('ajax');
    const store = this.get('simpleStore');

    return new Ember.RSVP.Promise(function(resolve, reject) {
      if (store.find(modelName).get('length') >= minSize) {
        resolve(store.find(modelName));
        return;
      }

      ajax.request(ajaxBody, function(response) {
        response.forEach(function(item) {
          store.push(modelName, item);
        });
        resolve(store.find(modelName));
      }, reject);
    });
  },

  findOne(modelName, id, ajaxBody) {
    const ajax = this.get('ajax');
    const store = this.get('simpleStore');

    return new Ember.RSVP.Promise(function(resolve, reject) {
      if (store.find(modelName, id).get('id') == id) {
        resolve(store.find(modelName, id));
        return;
      }

      ajax.request(ajaxBody, function(response) {
        store.push(modelName, response);
        resolve(store.find(modelName, id));
      }, reject);
    });
  },

  fetchById(modelName, id) {
    const store = this.get('simpleStore');
    return store.find(modelName, id);
  }
});
