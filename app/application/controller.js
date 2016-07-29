import Ember from 'ember';

export default Ember.Controller.extend({
  hostAppliance: Ember.inject.service(),
  // Computed properties do not work in the route, they only works in the controller. More research required.
  currentAppliance: Ember.computed('hostAppliance.activeHost', function() {
    let hostAppliance = this.get('hostAppliance');
    console.log(`Active Host set to: ${hostAppliance.get('activeHost')}`);
    return (hostAppliance.get('activeHost')) ? `http://${hostAppliance.get('activeHost')}` : null;
  })
});
