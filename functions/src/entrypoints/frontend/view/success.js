'use strict';

const utils = require('../utils');

module.exports = (url, plant, plantDay) => {
  const twitterUrl = utils.makeTwitter(url);
  const facebookUrl = utils.makeFaceBook(url);
  const mailSubject = 'A message of gratitude';
  const mailBody = `Hi. I’m growing a virtual garden in the 21 Days of Gratitude app and wanted to share it with you. Click this link to check it out! ${url}`;
  const mailUrl = utils.makeEmail(mailBody, mailSubject);

  return `
    <div class="main">
      <div class="bonsai-box">
        <div class="box-content">
          <p class="day">Day ${plantDay}</p>
          <p class="day-text">${plant.title}</p>
        </div>
      </div>

      <div class="img-container">
        <img src="${plant.basiccardImageUrl}">
      </div>
      <br/>

      <div class="usersaid-container">
        <p>Grateful for: ${plant.userSaid}</p>
      </div>

      <br/>
      <div class="share-container">
        <a target="_blank" href="${facebookUrl}"><img src="https://${process.env.GCLOUD_PROJECT}.firebaseapp.com/assets/images/icons/facebook.png"></a>
        <a target="_blank" href="${twitterUrl}"><img src="https://${process.env.GCLOUD_PROJECT}.firebaseapp.com/assets/images/icons/twitter.png"></a>
        <a target="_blank" href="${mailUrl}"><img src="https://${process.env.GCLOUD_PROJECT}.firebaseapp.com/assets/images/icons/email.png"></a>
      </div>
    </div>

    <style>
      body {
        background-color: #FFF6EA;
      }

      .bonsai-box {
        width: 289px;
        height: 95px;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .usersaid-container {
        font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
        font-size: 18px;
      }

      .share-container {
        width: 190px;
      }

      .share-container a:nth-child(2) {
        transform: translateX(4px);
      }

      .share-container a {
        text-align: center;
      }

      .box-content {
        text-align: center;
        display: block !important;
        font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
      }

      .box-content p {
        padding: 5px;
      }

      .day-text {
        font-size: 32px;
      }

      .day {
        padding-top: 10px;
      }

      .main * {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: auto;
        position: relative;
        left: 0; right: 0;
        color: #4B465C;
      }
    </style>
`;
};
