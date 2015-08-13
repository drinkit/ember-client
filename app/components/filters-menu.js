import Ember from 'ember';

export default Ember.Component.extend({
	classNames: ["col-md-3"],
	attributeBindings: ["dataSpy:data-spy", "dataOffsetTop:data-offset-top"],
	dataSpy: "affix",
	dataOffsetTop: "200",
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
	}
});
