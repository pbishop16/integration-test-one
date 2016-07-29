import { Adapter } from 'ember-pouch';
import PouchDB from 'pouchdb';

function createDb() {
  let db = new PouchDB('local_pouch');
  return db;
}

export default Adapter.extend({
  init() {
    this._super(...arguments);
    this.set('db', createDb());
  }
});
