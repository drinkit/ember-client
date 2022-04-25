import { helper as buildHelper } from '@ember/component/helper';

export function humanizeQuantity([quantity, unit]) {
  return quantity ? quantity + ' ' + (unit ? unit : 'мл') : 'немного';
}

export default buildHelper(humanizeQuantity);
