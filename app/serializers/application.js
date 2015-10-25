import DS from 'ember-data';

export default DS.RESTSerializer.extend({
	isNewSerializerAPI: true,

	normalizeArrayResponse: function(store, primaryModelClass, payload, id, requestType) {
		var newPayload = {};
	    newPayload[primaryModelClass.modelName] = payload;
	    return this._super(store, primaryModelClass, newPayload, id, requestType);
	}
});
