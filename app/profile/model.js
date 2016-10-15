import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import DS from 'ember-data';

export default Model.extend({
  name: attr('string'),
  description: attr('string'),
  profile_rules: DS.hasMany('profile_rule')
});
