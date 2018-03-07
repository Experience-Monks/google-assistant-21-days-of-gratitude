'use strict';

module.exports = (app) => {
  const hasScreen = app.hasSurfaceCapability(app.SurfaceCapabilities.SCREEN_OUTPUT);
  const hasAvailableScreen = app.hasAvailableSurfaceCapabilities(app.SurfaceCapabilities.SCREEN_OUTPUT);
  
  const askForNewSurface = (tellUser, notificationTitle, contextName, contextParams = {}) => {
    app.setContext(contextName, 1, contextParams);
    app.askForNewSurface(tellUser, notificationTitle, [app.SurfaceCapabilities.SCREEN_OUTPUT]);
  };

  return {
    hasScreen,
    hasAvailableScreen,
    askForNewSurface,
  };
};
