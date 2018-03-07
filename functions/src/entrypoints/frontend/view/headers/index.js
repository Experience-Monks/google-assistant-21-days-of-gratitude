'use strict';

const constants = require('../../constants');
const fb = require('./fb');
const twitter = require('./twitter');
const google = require('./google');

module.exports = (url, plant) => {
  return `<html>
    <head>
      <title>${constants.title}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="description" content="${constants.description}" />
      ${fb(url, plant)}
      ${twitter(plant)}
      ${google(plant)}
    </head>
    <body>`;
};
