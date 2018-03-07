'use strict';

const gardenResponse = require('../responses/garden');

module.exports = (app) => {
  const { user, garden } = app;

  garden.create(user.getId())
    .then(() => {
      user.gardenId = garden.id;
      return user.update();
    })
    .then(() => gardenResponse.restartSaysYes(app))
    .catch(err => {
      throw err;
    });
};
