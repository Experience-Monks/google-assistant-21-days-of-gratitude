'use strict';

const actionDecorator = require('../../../utils/action-decorator');
const keys = require('./keys');
const startPoint = require('./start-point');
const fallback = require('./fallback');
const exit = require('./exit');
const newSurface = require('./new-surface');
const selectedOption = require('./selected-option');
const dailyUpdateAsk = require('./daily-update-ask');
const dailyUpdatesSave = require('./daily-update-save');
const help = require('./help');
const plantSaveImplicitTrigger = require('./plant-save-implicit-trigger');
const plantSaveImplicit = require('./plant-save-implicit');
const plantSaveImplicitExit = require('./plant-save-implicit-exit');
const plantSaveExplicit = require('./plant-save-explicit');
const plantSaveConfirmYes = require('./plant-save-confirm-yes');
const plantSaveConfirmNo = require('./plant-save-confirm-no');
const plantSaveConfirmFallback = require('./plant-save-confirm-fallback');
const plantEdit = require('./plant-edit');
const plantSearch = require('./plant-search');
const plantSearchImplicitTrigger = require('./plant-search-implicit-trigger');
const gardenChangePalettYes = require('./garden-change-palette-yes');
const gardenChangePalettNo = require('./garden-change-palette-no');
const gardenChangePaletteFallBack = require('./garden-change-palette-fallback');
const gardenChoosingPaletteFallBack = require('./garden-choosing-palette-fallback');
const gardenShow = require('./garden-show');
const gardenShowAsList = require('./garden-show-as-list');
const gardenRestart = require('./garden-restart');
const gardenRestartYes = require('./garden-restart-yes');
const gardenRestartNo = require('./garden-restart-no');
const gardenRestartFallBack = require('./garden-restart-fallback');
const sxswPlantDeleteToday = require('./sxsw-plant-delete-today');
const sxswPlantImport = require('./sxsw-plant-import');
const adminUserDelete = require('./admin-user-delete');
const adminUserGetId = require('./admin-user-get-id');

const map = new Map();
map.set(keys.WELCOME, startPoint);
map.set(keys.FALLBACK, fallback);
map.set(keys.EXIT, exit);
map.set(keys.NEW_SURFACE, actionDecorator(newSurface));
map.set(keys.SELECTED_OPTION, actionDecorator(selectedOption));
map.set(keys.DAILY_UPDATE_ASK, actionDecorator(dailyUpdateAsk));
map.set(keys.DAILY_UPDATE_SAVE, actionDecorator(dailyUpdatesSave));
map.set(keys.HELP, actionDecorator(help));
map.set(keys.PLANT_SAVE_IMPLICIT_TRIGGER, actionDecorator(plantSaveImplicitTrigger));
map.set(keys.PLANT_SAVE_IMPLICIT, actionDecorator(plantSaveImplicit));
map.set(keys.PLANT_SAVE_IMPLICIT_EXIT, actionDecorator(plantSaveImplicitExit));
map.set(keys.PLANT_SAVE_EXPLICIT, actionDecorator(plantSaveExplicit));
map.set(keys.PLANT_SAVE_CONFIRM_YES, actionDecorator(plantSaveConfirmYes));
map.set(keys.PLANT_SAVE_CONFIRM_NO, actionDecorator(plantSaveConfirmNo));
map.set(keys.PLANT_SAVE_CONFIRM_FALLBACK, actionDecorator(plantSaveConfirmFallback));
map.set(keys.PLANT_EDIT, actionDecorator(plantEdit));
map.set(keys.PLANT_SEARCH, actionDecorator(plantSearch));
map.set(keys.PLANT_SEARCH_IMPLICIT_TRIGGER, actionDecorator(plantSearchImplicitTrigger));
map.set(keys.GARDEN_CHANGE_PALETTE_YES, actionDecorator(gardenChangePalettYes));
map.set(keys.GARDEN_CHANGE_PALETTE_NO, actionDecorator(gardenChangePalettNo));
map.set(keys.GARDEN_CHANGE_PALETTE_FALLBACK, actionDecorator(gardenChangePaletteFallBack));
map.set(keys.GARDEN_CHOOSING_PALETTE_FALLBACK, actionDecorator(gardenChoosingPaletteFallBack));
map.set(keys.GARDEN_SHOW, actionDecorator(gardenShow));
map.set(keys.GARDEN_SHOW_AS_LIST, actionDecorator(gardenShowAsList));
map.set(keys.GARDEN_RESTART, actionDecorator(gardenRestart));
map.set(keys.GARDEN_RESTART_YES, actionDecorator(gardenRestartYes));
map.set(keys.GARDEN_RESTART_NO, actionDecorator(gardenRestartNo));
map.set(keys.GARDEN_RESTART_FALLBACK, actionDecorator(gardenRestartFallBack));
map.set(keys.SXSW_PLANT_DELETE_TODAY, actionDecorator(sxswPlantDeleteToday));
map.set(keys.SXSW_PLANT_IMPORT, actionDecorator(sxswPlantImport));
map.set(keys.ADMIN_USER_DELETE, actionDecorator(adminUserDelete));
map.set(keys.ADMIN_USER_GET_ID, actionDecorator(adminUserGetId));

module.exports = map;