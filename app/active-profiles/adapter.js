import ApplicationAdapter from '../application/adapter';
import Ember from 'ember';

export default ApplicationAdapter.extend({
  pathForType(type) {
    return Ember.String.underscore(type);
  }
});
