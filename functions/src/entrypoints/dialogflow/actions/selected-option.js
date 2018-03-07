'use strict';

const errorResponse = require('../responses/error');
const gardenResponse = require('../responses/garden');
const plantResponse = require('../responses/plant');
const Garden = require('../../../model/garden');

module.exports = (app) => {
  const selectedOption = JSON.parse(app.getSelectedOption());

  if (selectedOption.type && selectedOption.value) {
    switch (selectedOption.type) {
      case 'plant_list': {
        const { garden } = app;
        const day = selectedOption.value;
        const plant = garden.getPlantByDay(day);

        if (plant) {
          plantResponse.show(app, plant);
        } else {
          plantResponse.showCantFindPlant(app, day);
        }
        break;
      }
      case 'choose_palette': {
        if (selectedOption.value === Garden.TYPE_1 || selectedOption.value === Garden.TYPE_2) {
          const { garden } = app;
          const { value: gardenType } = selectedOption;
          garden.type = gardenType;

          garden.update()
            .then(() => gardenResponse.changePaletteSuccess(app));
        } else {
          gardenResponse.choosingPaletteFallback(app)
        }
        break;
      }
      default: {
        errorResponse.general(app);
      }
    }
  } else {
    errorResponse.general(app);
  }
};
