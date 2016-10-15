import attr from 'ember-data/attr';
import Model from 'ember-data/model';
// import hasMany from 'ember-data/relationships';
// import DS from 'ember-data';


export default Model.extend({
  serial: attr(),
  expiration: attr(),
  profile: attr(),
  schedule: attr(),
  keypad: attr()
});
