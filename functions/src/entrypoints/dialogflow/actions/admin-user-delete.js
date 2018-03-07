'use strict';

const lastPrompt = require('../responses/last-prompt');

module.exports = (app) => {
  const { user, garden } = app;

  if (user.isAdmin) {
    user.delete()
      .then(() => garden.delete())
      .then(()=> app.tell('User deleted, restart the app.'))
      .catch(() => app.tell('Could not delete user.'));
  } else{
    lastPrompt.add(app);
  }
};
