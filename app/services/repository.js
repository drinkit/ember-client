import { Promise } from 'rsvp';
import Service, { inject as service } from '@ember/service';

export default class RepositoryService extends Service {
  @service simpleStore;
  @service ajax;

  find(modelName, ajaxBody, minSize= 1) {
    return new Promise(function(resolve, reject) {
      if (this.simpleStore.find(modelName).get('length') > minSize) {
        resolve(this.simpleStore.find(modelName));
        return;
      }

      const self = this;

      this.ajax.request(ajaxBody, function(response) {
        self.simpleStore.clear(modelName);
        response.forEach(function(item) {
          self.simpleStore.push(modelName, item);
        });
        resolve(self.simpleStore.find(modelName));
      }, reject);
    }, this);
  }

  findOne(modelName, id, ajaxBody) {
    return new Promise(function(resolve, reject) {
      if (this.simpleStore.find(modelName, id).get('id') == id) {
        resolve(this.simpleStore.find(modelName, id));
        return;
      }

      const self = this;

      this.ajax.request(ajaxBody, function(response) {
        self.simpleStore.push(modelName, response);
        resolve(self.simpleStore.find(modelName, id));
      }, reject);
    }, this);
  }

  fetchById(modelName, id) {
    return this.simpleStore.find(modelName, id);
  }
}
