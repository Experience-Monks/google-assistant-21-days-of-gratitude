'use strict';

const { contexts } = require('../constants');
const plantResponse = require('../responses/plant');

module.exports = (app, actionName) => {
  const contextArgument = app.getContextArgument(contexts.PLANT_SAVE_CONFIRM, 'userSaid');

  if (contextArgument) {
    const { value: userSaid } = contextArgument;
    plantResponse.saveConfirmFallback(app, userSaid);
  } else {
    throw new Error(`${actionName} > invalid contextArgument`);
  }
};
