import Ember from 'ember';

export default Ember.Route.extend({
  notify: Ember.inject.service(),
  setupController: function(controller, model) {
    this._super(controller, model);
    controller.set('heading', 'Edit Appliance');
    controller.set('buttonLabel', 'Update Appliance');
  },
  renderTemplate() {
    this.render('appliances/form');
  },
  actions: {
    saveAppliance(updateAppliance) {
      updateAppliance.save().then(() => this.transitionTo('appliances'));
      this.get('notify').success('Appliance successfully added.');
    },
    cancel(appliance) {
      let confirmation = confirm('Are you sure you want to cancel?');
      // let model = this.controller.get('model');

      if (confirmation) {
        appliance.rollbackAttributes();
        this.get('notify').info('Editing cancelled.');
			  this.transitionTo('appliance', appliance);
      }
    },
    willTransition(transition) {
      let model = this.controller.get('model');

      if (model.get('hasDirtyAttributes')) {
        let confirmation = confirm("Your changes haven't been saved yet. Would you like to leave this form?");

        if (confirmation) {
          model.rollbackAttributes();
        } else {
          transition.abort();
        }
      }
    }
  }
});
