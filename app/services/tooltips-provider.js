import Service from '@ember/service';

export default Service.extend({
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
        return 'лонг';
      case 2:
        return 'короткий';
      case 3:
        return 'шот';
      default:
        return '';
    }
  }
});
