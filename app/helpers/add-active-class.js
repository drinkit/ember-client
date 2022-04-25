import { helper as buildHelper } from '@ember/component/helper';

export function addActiveClass(isActive) {
  return isActive[0] ? "active" : "";
}

export default buildHelper(addActiveClass);
