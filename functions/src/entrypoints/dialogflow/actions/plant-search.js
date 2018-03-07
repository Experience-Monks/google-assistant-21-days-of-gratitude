'use strict';

const log = require('../../../utils/log');
const plantResponse = require('../responses/plant');

module.exports = (app, actionName) => {
  const { user, garden } = app;
  const gratitudeDay = app.getArgument('gratitudeDays');
  const gratitudeDayDirection = app.getArgument('gratitudeDaysDirection');
  const date = app.getArgument('date');
  let plant;

  log.info(`${actionName} > search`, { id: app.id, userId: user.getId(), gratitudeDay, gratitudeDayDirection, date });

  if (typeof gratitudeDay === 'string') {
    const currentDay = garden.getCurrentDay();
    let day;

    if (gratitudeDay === 'today') day = currentDay;
    else if (gratitudeDay === 'yesterday') day = currentDay - 1;
    else if (gratitudeDayDirection === 'ago') day = currentDay - parseInt(gratitudeDay, 10);
    else day = parseInt(gratitudeDay, 10);

    plant = (0 < day && day <= 21) ? garden.getPlantByDay(day) : null;
  } else if (typeof date === 'string'){
    plant = garden.getPlantByDate(date);
  }

  if (plant) {
    plantResponse.search(app, plant);
  } else {
    plantResponse.searchCantFindPlant(app);
  }
};
