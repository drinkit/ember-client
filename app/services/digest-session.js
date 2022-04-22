import SessionService from 'ember-simple-auth/services/session';

export default class DigestSessionService extends SessionService {
  handleAuthentication(routeAfterAuthentication) {
    // do nothing
  }

  handleInvalidation(routeAfterInvalidation) {
    // do nothing
  }
}
