'use strict';

var url = '/aera/#/view';

var get = function (chapter) {
  var pageUrl = chapter ? url + '/chapter/' + chapter : url;
  return browser.get(pageUrl);
};

var getSelectedChapterTitle = function () {
  return $('.chapter-heading > h2').getText().then(function (title) { return title.toUpperCase() });
};

var getMenuIcon = function () {
  return $('.chapter-heading__button');
};

var isMenuIconDisplayed = function () {
  return getMenuIcon().isDisplayed();
};

var clickMenuIcon = function () {
  return getMenuIcon().click();
};

var getChapterList = function () {
  return $('.chapter-nav');
};

var isChapterListDisplayed = function () {
  return getChapterList().isDisplayed();
};

var getChapters = function () {
  return element.all(by.css('.chapter-nav__link'));
};

var selectChapter = function (chapter) {
  return getChapters().get(chapter).click();
};

exports.get = get;
exports.getSelectedChapterTitle = getSelectedChapterTitle;
exports.selectChapter = selectChapter;
exports.isMenuIconDisplayed = isMenuIconDisplayed;
exports.clickMenuIcon = clickMenuIcon;
exports.isChapterListDisplayed = isChapterListDisplayed;