import layout from '../templates/components/share-panel';
import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  layout,
  classNames: ['share-panel'],
  buttonToComponent: null,
  buttons: '',
  labels: '',
  adaptive: true,

  init(...args) {
    this._super(...args);
    this.buttonToComponent = {'fb': 'fb-share-button',
      'facebook': 'fb-share-button',
      'vk': 'vk-share-button',
      'vkontakte': 'vk-share-button',
      'twitter': 'twitter-share-button',
      'linkedin': 'linkedin-share-button',
      'gplus': 'gplus-share-button'
    };
  },

  components: computed('buttons', function() {
    const buttons = this.splitData(this.get('buttons'));
    const labels = this.splitData(this.get('labels'));
    return buttons.map((item, index) =>
      ({name: this.get('buttonToComponent')[item], label: labels[index]}));
  }),

  splitData(data) {
    return data.split(',').map((item) => item.trim());
  }
});
