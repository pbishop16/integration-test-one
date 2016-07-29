import DS from 'ember-data';

export default DS.Model.extend({
  rule_active: DS.attr(),
  rule_delay: DS.attr(),
  rule_inactive: DS.attr(),
  zone_id: DS.attr(),
  zone_name: DS.attr()
});
