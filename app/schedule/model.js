import attr from 'ember-data/attr';
import Model from 'ember-data/model';

export default Model.extend({
  name: attr(),
  create_time: attr(),
  description: attr(),
  duration: attr(),
  last_date: attr(),
  priority: attr(),
  profile_id: attr(),
  sched_time: attr(),
  sched_type: attr(),
  start_date: attr()
});
