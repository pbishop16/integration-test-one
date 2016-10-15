import attr from 'ember-data/attr';
// import Ember from 'ember';
import Model from 'model';

export default Model.extend({
  serial: attr(),
  active: attr(),
  total: attr(),
  completed: attr(),
  failed: attr()
});
