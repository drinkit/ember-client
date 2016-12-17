import Ember from 'ember';

export default Ember.Component.extend({
  burgerMenu: Ember.inject.service(),
  classNames: ['search-box'],
  actions: {
    search: function(value) {
      this.sendAction('search', value);
      $('input[type="search"]').blur();
      this.get('burgerMenu').toggleProperty('open');
    }
  }
});
