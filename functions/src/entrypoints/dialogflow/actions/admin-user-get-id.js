'use strict';

const { TOKEN_FOR_USER_ID } = require('../../../config');
const lastPrompt = require('../responses/last-prompt');

module.exports = (app) => {
  const { user } = app;
  const token = app.getArgument('token');

  if (typeof token === 'string' && token === TOKEN_FOR_USER_ID) {
    app.ask({
      speech: 'Your Id',
      displayText: user.getId(),
    });
  } else {
    lastPrompt.add(app);
  }
};
