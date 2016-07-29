import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('appliances', function() {
    this.route('new');
  });
  this.route('appliance', { path: '/appliances/:appliance_id' }, function() {
    this.route('edit');
  });
  this.route('profiles');
  this.route('profile', { path: 'profiles/:profile_id' });
  this.route('lights');
  this.route('light', { path: 'lights/:light_id' });
  this.route('zones', function() {
    this.route('zone', { path: '/:zone_id' });
  });
});

export default Router;
