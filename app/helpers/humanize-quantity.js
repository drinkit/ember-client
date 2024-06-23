import { helper as buildHelper } from '@ember/component/helper';
import localize from "../utils/localize";

export function humanizeQuantity([quantity, unit]) {
  function localizedUnit() {
  return unit && unit !== 'мл' ? unit : localize('мл', 'ml', 'мл');
}
  return quantity ? quantity + ' ' + localizedUnit() : localize('немного', 'a bit', 'трохи');
}



export default buildHelper(humanizeQuantity);
