import Service from '@ember/service';

export default class ModalManagerService extends Service {
  showDialog(dialogName) {
    this.set('isShow' + dialogName, true);
  }

  hideDialog(dialogName) {
    this.set('isShow' + dialogName, false);
  }
}
