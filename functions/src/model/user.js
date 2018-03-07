'use strict';

const { SXSW_USERS, ADMIN_USERS } = require('../config');
const { db } = require('../utils/admin');
const log = require('../utils/log');

const COLLECTION = 'users';

class User {
  constructor() {
    this.id = 0;
    this.exists = false;
    this.gardenId = null;
    this.hasDailyUpdate = false;
    this.isSXSW = false;
    this.isAdmin = false;
    this.createdAt = null;
    this.docRef = null;
  }

  getId() {
    return this.id;
  }

  get data() {
    return {
      gardenId: this.gardenId,
      hasDailyUpdate: this.hasDailyUpdate,
      isSXSW: this.isSXSW,
      isAdmin: this.isAdmin,
      createdAt: this.createdAt,
    };
  }

  set data(obj) {
    this.gardenId = obj.hasOwnProperty('gardenId') ? obj.gardenId : this.gardenId;
    this.hasDailyUpdate = obj.hasOwnProperty('hasDailyUpdate') ? obj.hasDailyUpdate : this.hasDailyUpdate;
    this.isSXSW = obj.hasOwnProperty('isSXSW') ? obj.isSXSW : this.isSXSW;
    this.isAdmin = obj.hasOwnProperty('isAdmin') ? obj.isAdmin : this.isAdmin;
  }

  getDocRef(id) {
    this.docRef = !this.docRef ? db.doc(`${COLLECTION}/${id}`) : this.docRef;
    return this.docRef;
  }

  create(id) {
    this.isSXSW = SXSW_USERS.includes(id);
    this.isAdmin = ADMIN_USERS.includes(id);
    this.createdAt = Date.now();

    return this.getDocRef(id).set(this.data)
      .then(result => {
        log.info('User > create', { userId: id, result });
        this.id = id;
        this.exists = true;
        return result;
      })
      .catch(err => {
        log.error('User > create', { userId: id, err });
        throw err;
      });
  }

  update() {
    return this.getDocRef(this.id).update(this.data)
      .then(result => {
        log.info('User > update', { userId: this.id, result });
        return result;
      })
      .catch(err => {
        log.error('User > update', { userId: this.id, err });
        throw err;
      });
  }

  delete() {
    return this.getDocRef(this.id).delete()
      .then(result => {
        log.info('User > delete', { userId: this.id, result });
        return result;
      })
      .catch(err => {
        log.error('User > delete', { userId: this.id, err });
        throw err;
      });
  }
    
  loadById(id) {
    return this.getDocRef(id).get()
      .then(doc => {
        log.info('User > loadById', { userId: id, doc });

        if (doc.exists) {
          this.exists = true;
          this.id = id;
          this.data = doc.data();
        }
      })
      .catch(err => {
        log.error('User > loadById', { userId: id, err });
        throw err;
      });
  }

  static get COLLECTION() {
    return COLLECTION;
  }
}

module.exports = User;
