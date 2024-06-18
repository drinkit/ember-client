import {helper} from '@ember/component/helper';
import localize from "../utils/localize";

export default helper(function localized(params, hash) {
  const { ru, en, uk } = hash;
  return localize(ru, en, uk);
});
