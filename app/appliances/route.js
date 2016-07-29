import Ember from 'ember';

export default Ember.Route.extend({
  notify: Ember.inject.service(),
  hostAppliance: Ember.inject.service(),
  model() {
    return this.store.findAll('appliance');
  },
  show: false,
  actions: {
    setActive(appliance) {
      // Need to set current active appliance to false
      let hostAppliance = this.get('hostAppliance');
      let name = appliance.get('name');
      this.controller.get('model').setEach('active', false);
      appliance.set('active', true);
      console.log(appliance.get('url'));
      hostAppliance.set('activeHost', appliance.get('url'));
      hostAppliance.set('activeKey', appliance.get('key'));
      console.log(`Set Host Appliance: ${hostAppliance.get('activeHost')}`);
      this.get('notify').success(`The Appliance "${name}" is now connected.`);
    },
    setInactive(appliance) {
      let hostAppliance = this.get('hostAppliance');
      let name = appliance.get('name');
      appliance.set('active', false);
      hostAppliance.emptyHost();
      this.get('notify').warning(`The Appliance ${name} is now disconnected.`);
    },
    deleteAppliance(appliance) {
      let confirmation = confirm('Are you sure?');

      if(confirmation) {
        appliance.destroyRecord();
        this.get('notify').alert('Deletion successful.');
      }
    }
  }
});
