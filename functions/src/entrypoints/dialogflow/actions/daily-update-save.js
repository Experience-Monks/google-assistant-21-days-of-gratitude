'use strict';

const dailyUpdateResponse = require('../responses/daily-update');

module.exports = (app) => {
  if (app.isUpdateRegistered()) {
    const { user } = app;
    user.hasDailyUpdate = true;
    user.update()
      .then(() => {
        dailyUpdateResponse.saysYes(app);
      });
  } else {
    dailyUpdateResponse.saysNo(app);
  }
};
