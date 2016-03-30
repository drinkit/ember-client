import ApplicationAdapter from './application';
import UrlTemplates from "ember-data-url-templates";

export default ApplicationAdapter.extend(UrlTemplates, {
  urlTemplate: '{+host}/rest/recipes/{recipeId}/comments{/id}',
  findUrlTemplate: '{+host}/rest/recipes/{recipeId}/comments/{id}',
  createRecordUrlTemplate: '{+host}/rest/recipes/{recipeId}/comments',

  adapterContext: Ember.inject.service(),

  urlSegments: {
    recipeId() {
      return this.get('adapterContext.recipeId');
    }
  }
});
