import Ember from 'ember';

export default Ember.Route.extend({
  notify: Ember.inject.service(),
  model() {
    return this.store.findAll('profile');
  },
  actions: {
    
  }

});
