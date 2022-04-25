import { helper as buildHelper } from '@ember/component/helper';

export function safeVal([value, defaultValue]) {
  return value || defaultValue;
}

export default buildHelper(safeVal);
