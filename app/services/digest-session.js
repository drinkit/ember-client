import SessionService from 'ember-simple-auth/services/session';
import { inject as service } from '@ember/service';

export default class DigestSessionService extends SessionService {
  @service currentUser;

  handleAuthentication(routeAfterAuthentication) {
    // do nothing
  }

  handleInvalidation(routeAfterInvalidation) {
    this.currentUser.unsetUser();
  }
}
