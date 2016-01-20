import Ember from 'ember';

export default Ember.Mixin.create({

  scrollSelector: window,

  activate: function() {
    this._super.apply(this, arguments);
    var self = this;
    if (this.get('lastScroll')) {

      Ember.run.next(function() {
        Ember.$(self.scrollSelector).scrollTop(self.get('lastScroll'));
      });

    } else {
      Ember.$(this.scrollSelector).scrollTop(0);
    }
  },

  deactivate: function() {
    this._super.apply(this, arguments);
    this.set('lastScroll', Ember.$(this.scrollSelector).scrollTop());
  }

});
