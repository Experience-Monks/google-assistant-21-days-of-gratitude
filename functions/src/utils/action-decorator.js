'use strict';

const log = require('./log');

module.exports = (action) => {
  return (app) => {
    const { user, garden } = app;
    const actionName = app.body_ && app.body_.result && app.body_.result.action ? app.body_.result.action : '';

    if (!user.exists) {
      throw new Error(`${actionName} > user does not exist`, { id: app.id });
    } else if (!garden.exists) {
      throw new Error(`${actionName} > garden does not exist`, { id: app.id });
    } else {
      log.info(`${actionName} > start`, { id: app.id, userId: user.getId() });
      action(app, actionName);
    }
  };
};
