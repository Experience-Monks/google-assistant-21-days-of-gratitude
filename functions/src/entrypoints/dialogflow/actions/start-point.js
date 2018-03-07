'use strict';

const log = require('../../../utils/log');
const errorResponse = require('../responses/error');
const welcomeResponse = require('../responses/welcome');

const actionName = 'input.welcome';

const createGarden = (app) => {
  const { user, garden } = app;

  return garden.create(user.getId())
    .then(() => {
      user.gardenId = garden.id;
      log.info(`${actionName} > garden created`, { id: app.id, userId: user.getId(), garden: garden.getId() });
      return user.update();
    });
};

module.exports = (app) => {
  const { user, garden } = app;

  if (!user.exists) {
    log.info(`${actionName} > user does not exist`, { id: app.id, userId: app.getUser().userId });
    user.create(app.getUser().userId)
      .then(() => {
        log.info(`${actionName} > user created`, { id: app.id, userId: user.getId() });
        return createGarden(app);
      })
      .then(() => welcomeResponse.onboarding(app))
      .catch(err => {
        log.error(`${actionName} > error`, { id: app.id, userId: app.getUser().userId, err });
        errorResponse.fatal(app);
      });
  } else if (!garden.exists) {
    log.info(`${actionName} > user does not have a garden`, { id: app.id, userId: user.getId() });
    createGarden(app)
      .then(() => welcomeResponse.hasNotSavedTodaySession(app))
      .catch(err => {
        log.error(`${actionName} > error`, { id: app.id, userId: user.getId(), err });
        errorResponse.fatal(app);
      });
  } else if (garden.hasFinished()) {
    log.info(`${actionName} > user has finished his garden`, { id: app.id, userId: user.getId() });
    welcomeResponse.hasFinishedGarden(app);
  } else if (garden.hasSavedTodaysSession()) {
    log.info(`${actionName} > user has saved todays session`, { id: app.id, userId: user.getId() });
    welcomeResponse.hasSavedTodaysSession(app);
  } else {
    log.info(`${actionName} > user has not saved todays session`, { id: app.id, userId: user.getId() });
    welcomeResponse.hasNotSavedTodaysSession(app);
  }
};

