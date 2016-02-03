'use strict';

describe('View Page', function () {
  var page = require('./view.page.js');

  beforeEach(function () {
    page.get();
  });

  describe('Title Bar', function () {
    it('displays the first chapter title by default', function () {
      expect(page.getSelectedChapterTitle()).toBe('INTRODUCTION/EXECUTIVE SUMMARY');
    });

    it('displays the title of the chapter the user has navigated to', function () {
      page.get(3);
      expect(page.getSelectedChapterTitle()).toBe('GAS')
    });

    it('updates the title when the user navigates to a new chapter', function () {
      page.selectChapter(2);
      expect(page.getSelectedChapterTitle()).toBe('OIL');
    });

  });

  describe('(small screen)', function () {

    beforeEach(browser.setWindowSizeSmall);

    it('displays the menu icon', function () {
      expect(page.isMenuIconDisplayed()).toBe(true);
      expect(page.isChapterListDisplayed()).toBe(false);
    });

    it('shows and hides the chapter list appropriately', function () {
      page.clickMenuIcon();
      expect(page.isChapterListDisplayed()).toBe(true);

      page.clickMenuIcon();
      expect(page.isChapterListDisplayed()).toBe(false);

      page.clickMenuIcon();
      page.selectChapter(4);
      expect(page.isChapterListDisplayed()).toBe(false);
    });

  });

  describe('(large screen)', function () {

    beforeEach(browser.setWindowSizeLarge);

    it('doesn\'t display the menu icon', function () {
      expect(page.isMenuIconDisplayed()).toBe(false);
    });
    it('shows the chapter list', function () {
      expect(page.isChapterListDisplayed()).toBe(true);
    });
  });

});