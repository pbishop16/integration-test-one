import Model from 'ember-data/model';
import attr from 'ember-data/attr';

export default Model.extend({
  name: attr(),
  sn: attr(),
  serial: attr(),
  zone_id: attr(),
  room_uuid: attr(),
  pos_x: attr(),
  pos_y: attr()
});
