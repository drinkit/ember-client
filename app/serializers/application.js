import DS from 'ember-data';

export default DS.RESTSerializer.extend({
  isNewSerializerAPI: true,

  normalizeArrayResponse: function(store, primaryModelClass, payload, id, requestType) {
    var newPayload = {};
    newPayload[primaryModelClass.modelName] = payload;
    return this._super(store, primaryModelClass, newPayload, id, requestType);
  },

  normalizeSingleResponse: function(store, primaryModelClass, payload, id, requestType) {
    var newPayload = {};
    newPayload[primaryModelClass.modelName] = payload;
    return this._super(store, primaryModelClass, newPayload, id, requestType);
  },

  serializeIntoHash: function(data, type, record, options) {
    const json = this.serialize(record, options);
    for (var k in json) data[k] = json[k];
  }
});
