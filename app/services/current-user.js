import Service, { inject as service } from '@ember/service';
import { A } from '@ember/array';
import {tracked} from '@glimmer/tracking';

export default class CurrentUserService extends Service {
  @service digestSession;

  @tracked username = "";
  @tracked password = "";
  @tracked displayName = "";
  @tracked role = "";
  @tracked barItems = A();
  @tracked recipeStatsMap = {};
  @tracked isLoggedIn = false;

  get isAuthenticated() {
    return this.isLoggedIn && this.digestSession.isAuthenticated;
  }

  setUser(userInfo) {
    this.username = userInfo.username;
    this.password = userInfo.password;
    this.displayName = userInfo.displayName;
    this.role = userInfo.role;
    this.barItems = userInfo.barItems;
    this.recipeStatsMap = userInfo.recipeStatsMap || {};
    this.isLoggedIn = true;
  }

  unsetUser() {
    this.username = "";
    this.password = "";
    this.displayName = "";
    this.role = "";
    this.barItems = A();
    this.recipeStatsMap = {};
    this.isLoggedIn = false;
  }
}
