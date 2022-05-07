import { Promise } from 'rsvp';
import Service, { inject as service } from '@ember/service';
import CryptoJS from 'crypto-js';

export default class RepositoryService extends Service {
  @service simpleStore;
  @service ajax;

  promiseCache = {};

  find(modelName, ajaxBody, minSize= 1) {
    const self = this;
    const hash = CryptoJS.MD5(modelName + ajaxBody.toString());
    if (this.promiseCache.hasOwnProperty(hash)) {
      return this.promiseCache[hash];
    }

    const promise = new Promise(function(resolve, reject) {
      if (self.simpleStore.find(modelName).get('length') > minSize) {
        delete self.promiseCache[hash];
        resolve(self.simpleStore.find(modelName));
        return;
      }

      self.ajax.request(ajaxBody, (response) => {
        self.simpleStore.clear(modelName);
        response.forEach(function(item) {
          self.simpleStore.push(modelName, item);
        });
        delete self.promiseCache[hash];
        resolve(self.simpleStore.find(modelName));
      }, (param) => {
        delete self.promiseCache[hash];
        reject(param);
      });
    });

    this.promiseCache[hash] = promise;
    return promise;
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
