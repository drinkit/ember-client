import Ember from 'ember';

export function toLowerCase(input) {
	if (input.length === 1 && input[0] !== undefined) {
		var str = input[0];
  		return str.toLowerCase();
	};
}

export default Ember.Helper.helper(toLowerCase);
