import DS from 'ember-data';

export default DS.Model.extend({
    cocktailsTypes: DS.attr(),
    cocktailsOptions: DS.attr(),
    ingredients: Ember.computed({
        get() {
            return this.store.findAll('ingredient');
        }
    })
});
