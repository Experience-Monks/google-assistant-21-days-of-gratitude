'use strict';

class Utils {
  static getRandomValue(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  static randomString(stringArray) {
    if (!stringArray.length) {
      return null;
    }
    return Utils.getRandomValue(stringArray);
  }
}

module.exports = Utils;
