import DS from 'ember-data';
import Ember from 'ember';

export default DS.JSONSerializer.extend({
  primaryKey: 'id',
  extractId(modelClass, resourceHash) {
    return resourceHash[this.get('primaryKey')];
  },
  keyForAttribute: function(attr) {
    return Ember.String.underscore(attr);
  },
  keyForRelationship: function(attr) {
    return Ember.String.underscore(attr);
  },

});
