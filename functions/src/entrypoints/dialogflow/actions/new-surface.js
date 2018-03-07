const { contexts } = require('../constants');
const gardenResponse = require('../responses/garden');
const plantResponse = require('../responses/plant');

module.exports = (app, actionName) => {
  const { garden } = app;
  const isNewSurface = app.isNewSurface();
  const possibleContexts = [
    contexts.NEW_SURFACE_PLANT_SAVED,
    contexts.NEW_SURFACE_PLANT_SEARCH,
    contexts.NEW_SURFACE_GARDEN_SHOW,
    contexts.NEW_SURFACE_GARDEN_SHOW_AS_LIST,
  ];
  const context = app.getContexts()
    .map(item => item.name)
    .filter(name => possibleContexts.includes(name))
    .pop();

  if (context) {
    app.setContext(context, 0);
  }

  switch (context) {
    case contexts.NEW_SURFACE_PLANT_SAVED: {
      const plantDay = app.getContextArgument(context, 'plantDay');

      if (plantDay) {
        const plant = garden.getPlantByDay(plantDay.value);

        if (isNewSurface) {
          plantResponse.savedThatMovedToPhone(app, plant);
        } else {
          plantResponse.savedThatStayedOnGoogleHome(app, plant);
        }
      }
      break;
    }
    case contexts.NEW_SURFACE_PLANT_SEARCH: {
      const plantDay = app.getContextArgument(context, 'plantDay');

      if (plantDay) {
        const plant = garden.getPlantByDay(plantDay.value);

        if (isNewSurface) {
          plantResponse.searchThatMovedToPhone(app, plant);
        } else {
          plantResponse.searchThatStayedOnGoogleHome(app);
        }
      }
      break;
    }
    case contexts.NEW_SURFACE_GARDEN_SHOW: {
      if (isNewSurface) {
        gardenResponse.showThatMovedToPhone(app);
      } else {
        gardenResponse.showThatStayedOnGoogleHome(app);
      }
      break;
    }
    case contexts.NEW_SURFACE_GARDEN_SHOW_AS_LIST: {
      if (isNewSurface) {
        gardenResponse.showAsListThatMovedToPhone(app);
      } else {
        gardenResponse.showAsListThatStayedOnGoogleHome(app);
      }
      break;
    }
    default: {
      throw new Error(`${actionName} > invalid context`);
    }
  }
};
