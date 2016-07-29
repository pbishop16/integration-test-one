import RESTAdapter from 'ember-data/adapters/rest';
import Ember from 'ember';

export default RESTAdapter.extend({
  hostAppliance: Ember.inject.service(),
  // Volatile used in order to recompute the headers and host with every request
  headers: Ember.computed('hostAppliance.activeKey', function() {
    let hostAppliance = this.get('hostAppliance');
    return {
      "Authorization": `${hostAppliance.get('activeKey')}`,
      "Accept": 'application/json',
      "Content-Type": 'application/json'
    };
  }),
  host: Ember.computed('hostAppliance.activeHost', function() {
    let hostAppliance = this.get('hostAppliance');
    console.log(`Profile Adapter Host: http://${hostAppliance.get('activeHost')}`);
    return `http://${hostAppliance.get('activeHost')}`;
  }),
  // host: currentAppliance,
  namespace: 'v1'
});
