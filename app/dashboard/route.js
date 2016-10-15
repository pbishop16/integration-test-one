import Ember from 'ember';
import moment from 'moment';

export default Ember.Route.extend({
  model() {
    return Ember.RSVP.hash({
      profiles: this.store.findAll('profile'),
      lights: this.store.findAll('light'),
      zones: this.store.findAll('zone'),
      appliances: this.store.findAll('appliance')
    });
  },
  // afterModel(model) {
  //   let appliance = model.appliances.findBy('active', true);
  //
  //   console.log(this.get('appliance').name);
  // },
  setupController(controller, model) {
    this._super(controller, model);
    controller.set('profiles', model.profiles);
    controller.set('lights', model.lights);
    controller.set('zones', model.zones);
    controller.set('appliance', model.appliances.findBy('active', true));
    // controller.get('appliance').setProperties({
    //   lightsCount: 23,
    //   zonesCount: 2,
    //   profilesCount: 5
    // });
  },
  actions: {
    didTransition: function() {
      this.controller.get('appliance').setProperties({
        lightsCount: this.controller.get('lights.length'),
        zonesCount: this.controller.get('zones.length'),
        profilesCount: this.controller.get('profiles.length'),
        updatedAt: moment().format('MMM Do YY, h:mm a')
      });

      this.controller.get('appliance').save();
    }
  }
});
