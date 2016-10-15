import Model from 'ember-data/model';
import attr from 'ember-data/attr';

export default Model.extend({
  rule_active: attr(),
  rule_delay: attr(),
  rule_inactive: attr(),
  zone_id: attr(),
  zone_name: attr()
});
