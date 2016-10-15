import Ember from 'ember';

export default Ember.Route.extend({
  notify: Ember.inject.service(),
  hostAppliance: Ember.inject.service(),
  model(params) {
    // return this.store.findRecord('appliance', params.appliance_id);

      return this.store.findRecord('appliance', params.appliance_id);
      // activeProfiles: function() {
      //   if(appliance.active) {
      //     return this.store.findAll('active-profiles');
      //   } else {
      //     return null;
      //   }
      // }

  },
  setupController(controller, model) {
    this._super(controller, model);
    controller.set('pulledProfiles', Ember.A());
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
