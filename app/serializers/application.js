import DS from 'ember-data';

export default DS.RESTSerializer.extend({
	extractArray: function(store, type, payload) {
	    var newPayload = {};
	    newPayload[type.modelName] = payload;
	    return this._super(store, type, newPayload);
	  }
});
