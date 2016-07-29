import Ember from 'ember';
import Model from 'ember-pouch/model';
import attr from 'ember-data/attr';

const { computed } = Ember;

export default Model.extend({
  name: attr(),
  key: attr(),
  ip: attr('string'),
  url: Ember.computed('ip', function() {

    let ip = this.get('ip');
    return `${ip}/api`;
  }),
  active: attr('boolean'),
  nameNotValid: computed.notEmpty('name'),
  keyNotValid: computed.notEmpty('key'),
  ipIsValid: computed.match('ip', /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/),
  setDisabled: computed.and('nameNotValid', 'keyNotValid'),
  isDisabled: computed.and('setDisabled', 'ipIsValid')
});
