import Service, {inject as service} from '@ember/service';

export default class HintsManager extends Service {
  @service dayjs;

  needToShowHint(hintName) {
    return !window.localStorage.getItem(hintName);
  }

  hintShown(hintName) {
    window.localStorage.setItem(hintName, this.dayjs.self().toJSON());
  }
}
