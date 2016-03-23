import Ember from 'ember';

export default Ember.Service.extend({
  getTagTooltip(tagId) {
    switch (tagId) {
      case 1:
        return 'горящий';
      case 2:
        return 'со льдом';
      case 3:
        return 'проверенный модераторами';
      case 4:
        return 'утвержденный международной ассоциацией барменов (IBA)';
      case 5:
        return 'слоенный';
      default:
        return '';
    }
  },

  getTypeTooltip(typeId) {
    switch (typeId) {
      case 1:
        return 'лонги';
      case 2:
        return 'короткие';
      case 3:
        return 'шоты';
      default:
        return '';
    }
  }
});
