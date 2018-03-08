function amperOctoPlus(s) {
  s = s.replace(/&/g, '%26');
  s = s.replace(/#/g, '%23');
  s = s.replace(/\+/g, '%2B');
  s = s.replace(/@/g, '%40');
  s = s.replace(/:/g, '%3A');
  return s;
}

module.exports.makeFaceBook = (url) => {
  return "https://www.facebook.com/sharer/sharer.php?u=" + amperOctoPlus(encodeURI(url));
};

module.exports.makeTwitter = (url) => {
  let tweetNew = encodeURI(url);
  tweetNew = amperOctoPlus(tweetNew);

  return "https://twitter.com/intent/tweet?url=" + tweetNew;
};

module.exports.makeGPlus = (url) => {
  return "https://plus.google.com/share?url=" + amperOctoPlus(encodeURI(url));
};

module.exports.makeLinkedIn = (url, title, summary) => {
  let liTitleNew = encodeURI(title);
  liTitleNew = amperOctoPlus(liTitleNew);
  let liSummaryNew = encodeURI(summary);
  liSummaryNew = amperOctoPlus(liSummaryNew);

  return "https://www.linkedin.com/shareArticle?mini=true&url=" + amperOctoPlus(encodeURI(url)) + "&title=" + amperOctoPlus(liTitleNew) + "&summary=" + amperOctoPlus(liSummaryNew) + "&source=" + amperOctoPlus(encodeURI(url));
};


module.exports.makePinterest = (imageUrl, summary, url) => {
  let pinImageNew = encodeURI(imageUrl);
  pinImageNew = amperOctoPlus(pinImageNew);
  let pinSummaryNew = encodeURI(summary);
  pinSummaryNew = amperOctoPlus(pinSummaryNew);

  return "https://pinterest.com/pin/create/button/?url=" + amperOctoPlus(encodeURI(url)) + "&media=" + pinImageNew + "&description=" + pinSummaryNew;
};


module.exports.makeEmail = (body, subject) => {
  let emailBody = encodeURI(body);
  emailBody = amperOctoPlus(emailBody);

  let emailString;
  emailString = "mailto:?";

  if (subject !== "") {
    emailString = emailString + "subject=" + subject;
  }

  if (body !== "") {
    emailString = emailString + "&body=" + emailBody;
  }

  return emailString;
};
