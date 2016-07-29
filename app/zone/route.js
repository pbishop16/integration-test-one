import Ember from 'ember';

export default Ember.Route.extend({
  model(params) {
    return this.store.findRecord('zone', params.zone_id);
  },
  actions: {
    
  }
});
