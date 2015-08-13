import Ember from 'ember';

export default Ember.Component.extend({
	classNames: ["col-md-3"],
	dataOffsetTop: 185,
	dataOffsetBottom: null,
	actions: {
		toggleOption(id) {
			this.sendAction("toggleOption", id);
		},
		toggleType(id) {
			this.sendAction("toggleType", id);
		},
		doSearch() {
			this.sendAction("doSearch");
		}
	},
	didInsertElement: function() {
	    var options = {
	      offset: {
	        top:    this.get('dataOffsetTop'),
	        bottom: this.get('dataOffsetBottom')
	      }
	    };
	    this.$("#filtersMenu").affix(options);
	}
});
