import Route from '@ember/routing/route';
import { next } from '@ember/runloop';

export default class RememberScrollRoute extends Route {
  lastScroll = 0;

  activate() {
    super.activate();
    const self = this;
    if (this.get('lastScroll')) {
      next(function() {
        window.scrollTo(0, self.lastScroll);
      });
    } else {
      window.scrollTo(0, 0);
    }
  }

  deactivate() {
    super.deactivate();
    this.lastScroll = window.scrollY;
  }

}
