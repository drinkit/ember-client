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
		},
		clearFilters() {
			this.$('#filtersMenu button.active').attr('aria-pressed', "false");
			this.$('#filtersMenu button.active').button('refresh');
			this.$('#filtersMenu button.active').removeClass('active');
			this.$('.ember-chosen option').prop('selected', false).trigger('chosen:updated');
			//
			this.sendAction("clearFilters");
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
