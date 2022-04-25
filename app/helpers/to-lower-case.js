import { helper as buildHelper } from '@ember/component/helper';

export function toLowerCase(input) {
	if (input.length === 1 && input[0] !== undefined) {
    return input[0].toLowerCase();
	}
}

export default buildHelper(toLowerCase);
