import { next } from '@ember/runloop';
import Mixin from '@ember/object/mixin';

export default Mixin.create({

  scrollSelector: window,

  activate: function() {
    this._super.apply(this, arguments);
    const self = this;
    if (this.get('lastScroll')) {
      next(function() {
        self.scrollSelector.scrollTo(0, self.get('lastScroll'));
      });
    } else {
      self.scrollSelector.scrollTo(0, 0);
    }
  },

  deactivate: function() {
    this._super.apply(this, arguments);
    this.set('lastScroll', this.scrollSelector.scrollY);
  }

});
