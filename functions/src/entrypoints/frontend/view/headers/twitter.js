'use strict';

const constants = require('../../constants');

module.exports = (plant) => {
  return `<!-- Twitter Card data -->
<meta name="twitter:card" content="summary">
<meta name="twitter:title" content="${constants.title}">
<meta name="twitter:description" content="${plant.userSaid}">
<meta name="twitter:image:src" content="${plant.shareImageUrl}">`;
};
