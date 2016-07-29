import Ember from 'ember';

export default Ember.Service.extend({
  activeHost: null,
  activeKey: null,
  emptyHost() {
    console.log('Host cleared');
    console.log(`Active Host = ${this.get('activeHost')}`);
    this.set('activeHost', null);
    this.set('activeKey', null);
    console.log(`Active Host = ${this.get('activeHost')}`);
  }
});
