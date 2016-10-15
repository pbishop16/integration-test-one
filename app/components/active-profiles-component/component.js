import Ember from 'ember';
import { task, timeout } from 'ember-concurrency';

export default Ember.Component.extend({
  // init() {
  //   this._super(...arguments);
  //   // this.receivedProfiles = [];
  // },
  // didUpdateAttrs() {
  //   this._super(...arguments);
  //   this.receivedProfiles = [];
  // },
  // receivedProfiles: null,

  notify: Ember.inject.service(),

  // getActiveProfiles: [],

  // showActiveProfiles: Ember.A(),

  // items: Ember.computed.setDiff('getActiveProfiles', this.get('targetObject.store').findAll('active-profiles')),

  updateActiveProfiles: Ember.computed('getActiveProfiles', function(){
    // let setActiveProfiles = this.get('getActiveProfiles');
    // let setActiveProfiles2 = this.get('showActiveProfiles');
    //
    // setActiveProfiles2.forEach(function(item) {
    //   this.get('showActiveProfiles').popObject(item);
    // });
    //
    // setActiveProfiles.forEach(function(item) {
    //   this.get('showActiveProfiles').pushObject(item);
    // });
    // this.set('receivedProfiles', )
  }),
  // setActiveProfiles: null,

  pollServerForChanges: task(function * () {
    let notify = this.get('notify');
    yield timeout(500);
    try {
      notify.info('Appliance polling started');
      while (true) {
        yield timeout(8000);

        let store = this.get('targetObject.store');

        // if (store.findAll('active-profiles').length !== this.get('pulledProfiles').length) {

          store.unloadAll('active-profiles');

          let loadFromStore = store.findAll('active-profiles');

          this.set('pulledProfiles', loadFromStore);

        // }



        notify.info('Polling now...');
      }
    } finally {
      this.get('targetObject.store').unloadAll('active-profiles');
      notify.warning('Polling stopped...');
    }
  }).restartable(),

  didReceiveAttrs: function() {
    this.set('pulledProfiles', this.get('targetObject.store').findAll('active-profiles'));
  },

  didInsertElement: function() {
    this.get('pollServerForChanges').perform();
  },

});
