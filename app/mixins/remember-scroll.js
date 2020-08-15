import { next } from '@ember/runloop';
import Mixin from '@ember/object/mixin';

export default Mixin.create({

  scrollSelector: window,

  activate: function() {
    this._super.apply(this, arguments);
    var self = this;
    if (this.get('lastScroll')) {
      next(function() {
        self.scrollSelector.scrollTop = self.get('lastScroll');
      });

    } else {
      this.scrollSelector.scrollTop = 0;
    }
  },

  deactivate: function() {
    this._super.apply(this, arguments);
    this.set('lastScroll', this.scrollSelector.scrollTop);
  }

});
