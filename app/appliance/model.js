import Ember from 'ember';
import Model from 'ember-pouch/model';
import attr from 'ember-data/attr';
import moment from 'moment';

const { computed } = Ember;

export default Model.extend({
  name: attr(),
  key: attr(),
  ip: attr('string'),
  url: Ember.computed('ip', function() {

    let ip = this.get('ip');
    return `${ip}`;
  }),
  lightsCount: attr(),
  profilesCount: attr(),
  zonesCount: attr(),
  updatedAt: attr(),

  active: attr('boolean'),
  nameNotValid: computed.notEmpty('name'),
  keyNotValid: computed.notEmpty('key'),
  ipIsValid: computed.match('ip', /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/),
  setDisabled: computed.and('nameNotValid', 'keyNotValid'),
  isDisabled: computed.and('setDisabled', 'ipIsValid')
});
