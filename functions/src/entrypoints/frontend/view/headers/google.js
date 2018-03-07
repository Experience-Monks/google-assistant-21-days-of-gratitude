'use strict';

const constants = require('../../constants');

module.exports = (plant) => {
  return `<!-- Schema.org markup for Google+ -->
<meta itemprop="name" content="${constants.title}">
<meta itemprop="description" content="${plant.userSaid}">
<meta itemprop="image" content="${plant.shareImageUrl}">`;
};
