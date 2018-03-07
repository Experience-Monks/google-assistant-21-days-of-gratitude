'use strict';

const list = require('./list');
const lowerCaseList = list.map(item => item.toLowerCase());

module.exports.check = (text) => {
  if (typeof text === 'string') {
    text = text.toLowerCase();
    return Boolean(lowerCaseList
      .filter(item => text.includes(item))
      .length);
  } else {
    throw new Error('Text must be of type string');
  }
};
