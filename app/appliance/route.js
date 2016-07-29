import Ember from 'ember';

export default Ember.Route.extend({
  notify: Ember.inject.service(),
  hostAppliance: Ember.inject.service(),
  model(params) {
    return this.store.findRecord('appliance', params.appliance_id);
  },
  actions: {
    deleteAppliance(appliance) {
      let confirmation = confirm('Are you sure?');

      if(confirmation) {
        appliance.destroyRecord();
        this.get('notify').alert('Deletion successful.');
        this.transitionTo('appliances');
      }
    }
  }
});
