import { Promise } from 'rsvp';
import Service, { inject as service } from '@ember/service';

export default class RepositoryService extends Service {
  @service simpleStore;
  @service ajax;

  find(modelName, ajaxBody, minSize= 1) {
    const self = this;

    return new Promise(function(resolve, reject) {
      if (self.simpleStore.find(modelName).get('length') > minSize) {
        resolve(self.simpleStore.find(modelName));
        return;
      }

      self.ajax.request(ajaxBody, function(response) {
        self.simpleStore.clear(modelName);
        response.forEach(function(item) {
          self.simpleStore.push(modelName, item);
        });
        resolve(self.simpleStore.find(modelName));
      }, reject);
    });
  }

  findOne(modelName, id, ajaxBody) {
    const self = this;

    return new Promise(function(resolve, reject) {
      if (self.simpleStore.find(modelName, id).get('id') == id) {
        resolve(self.simpleStore.find(modelName, id));
        return;
      }

        self.ajax.request(ajaxBody, function(response) {
        self.simpleStore.push(modelName, response);
        resolve(self.simpleStore.find(modelName, id));
      }, reject);
    });
  }

  fetchById(modelName, id) {
    return this.simpleStore.find(modelName, id);
  }
}
