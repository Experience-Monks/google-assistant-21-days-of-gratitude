'use strict';

const { sprintf } = require('sprintf-js');
const { APP_URL } = require('../config');
const { db } = require('../utils/admin');
const plantsData = require('../json/plants');
const gardensData = require('../json/gardens');
const log = require('../utils/log');
const gratefulList = require('../json/grateful');
const utils = require('../utils/utils');

const COLLECTION = 'gardens';
const TYPE_1 = 1;
const TYPE_2 = 2;
const MAX_DAYS_FOR_GARDEN = 21;

class Garden {
  constructor() {
    this.id = 0;
    this.exists = false;
    this.userId = null;
    this.type = null;
    this.plants = [];
    this.createdAt = null;
    this.docRef = null;
  }

  getId() {
    return this.id;
  }

  get data() {
    return {
      userId: this.userId,
      type: this.type,
      plants: this.plants,
      createdAt: this.createdAt,
    };
  }

  set data(obj) {
    Object.keys(obj).forEach((prop) => {
      this[prop] = obj[prop];
    })
  }

  getDocRef(id) {
    if (!this.docRef) {
      this.docRef = db.doc(`${COLLECTION}/${id}`);
    }
    return this.docRef;
  }

  create(userId, type = TYPE_1) {
    const contract = Garden.contract(userId, type, [], Date.now());

    return db.collection(COLLECTION).add(contract)
      .then((doc) => {
        log.info('Garden > create', { gardenId: doc.id, doc });
        this.id = doc.id;
        this.exists = true;
        this.data = contract;
      })
      .catch(err => {
        log.error('Garden > create', { userId, err });
        throw err;
      });
  }

  delete() {
    return this.getDocRef(this.id).delete()
      .then(result => {
        log.info('Garden > delete', { gardenId: this.id, result });
        return result;
      })
      .catch(err => {
        log.error('Garden > delete', { gardenId: this.id, err });
        throw err;
      });
  }

  update() {
    return this.getDocRef(this.id).update(this.data)
      .then(result => {
        log.info('Garden > update', { gardenId: this.id, result });
        return result;
      })
      .catch(err => {
        log.error('Garden > update', { gardenId: this.id, err });
        throw err;
      });
  }

  loadById(id) {
    return this.getDocRef(id).get()
      .then(doc => {
        log.info('Garden > loadById', { gardenId: id, doc });
        if (doc.exists) {
          this.exists = true;
          this.id = id;
          this.data = doc.data();
        }
      })
      .catch(err => {
        log.error('Garden > loadById', { gardenId: id, err });
        throw err;
      })
  }

  replaceTypeInString(copy) {
    return sprintf(copy, this.type);
  }

  addExtraDataToPlant(plant) {
    const newPlant = Object.assign({}, plant);
    const plantData = plantsData[plant.plantNumber - 1];
    newPlant.title = plantData.title;
    newPlant.listImageUrl = `${APP_URL}assets/${this.replaceTypeInString(plantData.list)}`;
    newPlant.basiccardImageUrl = `${APP_URL}assets/${this.replaceTypeInString(plantData.basiccard)}`;
    newPlant.shareImageUrl = `${APP_URL}assets/${this.replaceTypeInString(plantData.share)}`;
    return newPlant;
  }

  getBasiccardImageUrl() {
    const gardenData = gardensData.gardens[this.plants.length - 1];
    return `${APP_URL}assets/${this.replaceTypeInString(gardenData.basiccard)}`;
  }

  getPaletteImagesUrls() {
    const palette1 = sprintf(gardensData.default, TYPE_1);
    const palette2 = sprintf(gardensData.default, TYPE_2);
    return [
      `${APP_URL}assets/${palette1}`,
      `${APP_URL}assets/${palette2}`,
    ];
  }

  getDaysBetween2Timestamps(timestamp1, timestamp2) {
    if (typeof timestamp1 !== 'number' || Number.isNaN(timestamp1) || typeof timestamp2 
    !== 'number' || Number.isNaN(timestamp2)) return;

    const timestamps = [timestamp1, timestamp2].map(timestamp => {
      const date = new Date(timestamp);
      const day = date.getUTCDate();
      const month = date.getUTCMonth() + 1;
      const year = date.getUTCFullYear();
      return Date.parse(`${year}-${month}-${day}`);
    });

    return Math.floor((timestamps[1] - timestamps[0]) / 86400000);
  }

  getCurrentDay() {
    return this.getDaysBetween2Timestamps(this.createdAt, Date.now()) + 1;
  }

  getPlantByDay(day) {
    day = parseInt(day, 10);
    const plant = this.plants.find(plant => plant.day === day);
    return plant ? this.addExtraDataToPlant(plant) : null;
  }

  getPlantByIndex(index) {
    index = parseInt(index, 10);
    // eslint-disable-next-line security/detect-object-injection
    const plant = (index > 0 && index < this.plants.length) ? this.plants[index] : null;
    return plant ? this.addExtraDataToPlant(plant) : null;
  }

  getPlantByDate(date) {
    const timestamp = Date.parse(date);
    if (Number.isNaN(timestamp)) return;
    const day = this.getDaysBetween2Timestamps(this.createdAt, timestamp) + 1;
    return this.getPlantByDay(day);
  }

  getTodaysPlant() {
    return this.getPlantByDay(this.getCurrentDay());
  }

  hasSavedTodaysSession() {
    const currentDay = this.getCurrentDay();
    const todaysPlant = this.plants.find(plant => plant.day === currentDay);

    return typeof todaysPlant === 'object';
  }

  hasFinished() {
    const lastDayAndSavedSession = this.getCurrentDay() === MAX_DAYS_FOR_GARDEN && this.hasSavedTodaysSession();
    return this.isMoreThanMaxDaysSinceCreated() || lastDayAndSavedSession;
  }

  isMoreThanMaxDaysSinceCreated() {
    return this.getCurrentDay() > MAX_DAYS_FOR_GARDEN;
  }

  createPlantObject(day, plantNumber, userSaid, createdAt) {
    return {
      day,
      plantNumber,
      userSaid,
      createdAt,
    };
  }

  savePlant(userSaid) {
    return new Promise((resolve, reject) => {
      if (!this.hasSavedTodaysSession()) {
        const day = this.getCurrentDay();
        const plantNumber = this.plants.length + 1;
        const createdAt = Date.now();
        const plant = Garden.plantContract(day, plantNumber, userSaid, createdAt);
        const plants = this.plants.concat(plant);

        this.getDocRef(this.id).update({
          plants,
        })
          .then(() => {
            this.plants = plants;
            resolve(this.addExtraDataToPlant(plant));
          })
          .catch(err => {
            reject(err);
          });
      } else {
        resolve(false);
      }
    });
  }

  sxswImportPlants(amount) {
    const plants = [];

    for (let i = amount; i > 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const userSaid = utils.randomString(gratefulList.prefixQuestion) + " " + utils.randomString(gratefulList.userSaid);
      const day = plants.length + 1;
      const plantNumber = plants.length + 1;
      const createdAt = date.getTime();
      const plant = Garden.plantContract(day, plantNumber, userSaid, createdAt);
      plants.push(plant);
    }

    const batch = db.batch();
    const gardenDate = new Date();
    this.plants = plants;
    gardenDate.setDate(gardenDate.getDate() - amount);
    this.createdAt = gardenDate.getTime();

    return batch.update(this.getDocRef(this.id), this.data).commit();
  }

  static get COLLECTION() {
    return COLLECTION;
  }

  static get TYPE_1() {
    return TYPE_1;
  }

  static get TYPE_2() {
    return TYPE_2;
  }

  static contract(userId, type, plants, createdAt) {
    return {
      userId,
      type,
      plants,
      createdAt,
    };
  }

  static plantContract(day, plantNumber, userSaid, createdAt) {
    return {
      day,
      plantNumber,
      userSaid,
      createdAt,
    };
  }
}

module.exports = Garden;
