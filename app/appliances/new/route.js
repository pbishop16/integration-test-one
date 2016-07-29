import Ember from 'ember';

export default Ember.Route.extend({
  notify: Ember.inject.service(),
  model() {
    return this.store.createRecord('appliance');
  },
  setupController: function(controller, model) {
    this._super(controller, model);
    controller.set('buttonLabel', 'Add appliance');
  },
  renderTemplate() {
    this.render('appliances/form');
  },
  actions: {
    saveAppliance(newAppliance) {
      newAppliance.save().then(() => this.transitionTo('appliances'));
      this.get('notify').success('Appliance successfully added.');
    },
    willTransition() {
      this.controller.get('model').rollbackAttributes();
    },
    cancel() {
      let confirmation = confirm('Are you sure you want to cancel?');
      // let model = this.controller.get('model');

      if (confirmation) {
        this.controller.get('model').rollbackAttributes();
        this.get('notify').info('New Appliance cancelled.');
			  this.transitionTo('appliances');
      }
    },
  }
});
