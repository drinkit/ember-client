import Ember from 'ember';
import RememberScrollMixin from '../mixins/remember-scroll';

export default Ember.Route.extend(RememberScrollMixin, {
    model(params) {
        return this.store.findRecord('recipe', params.recipe_id);
    },

    titleToken: function(model) {
      return model.get('name');
    },

    metrics: Ember.inject.service(),

    actions: {
      didTransition: function() {
        Ember.run.scheduleOnce('afterRender', this, () => {
          const page = document.location.pathname;
          const title = this.get('currentModel').get('name');

          Ember.get(this, 'metrics').trackPage({ page, title });
        });
      }
    }
});
