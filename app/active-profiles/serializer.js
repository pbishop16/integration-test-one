import Ember from 'ember';
import DS from 'ember-data';

export default DS.JSONSerializer.extend({
  primaryKey: 'serial',
  extractId(modelClass, resourceHash) {
    return resourceHash[this.get('primaryKey')];
  },
  attrs: {
    // profile: { embedded: 'always' },
    // schedule: { embedded: 'always' }
  },
  keyForAttribute: function(attr) {
    return Ember.String.underscore(attr);
  },
  keyForRelationship: function(attr) {
    return Ember.String.underscore(attr);
  },

});
