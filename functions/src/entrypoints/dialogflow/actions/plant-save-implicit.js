'use strict';

const { check: hasProfanity } = require('../../../utils/profanity-filter');
const plantResponse = require('../responses/plant');

module.exports = (app) => {
  const userSaid = app.getRawInput();

  if (hasProfanity(userSaid)) {
    plantResponse.profanityDetected(app);
  } else {
    plantResponse.saveConfirm(app, userSaid);
  }
};
