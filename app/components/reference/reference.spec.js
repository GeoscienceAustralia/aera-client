'use strict';

describe('Reference Input', function () {

  var directiveElement, referenceController;
  beforeEach(function () {

    module('aera-edit');
    module('components/edit/reference/reference.html');

    inject(function ($compile, $rootScope) {
      directiveElement = $compile('<aera-reference></aera-reference>')($rootScope);
      $rootScope.$digest();
      referenceController = directiveElement.controller('aeraReference');
    });
  });

  it('allows the user to input author, publication year, title, publication, url & date accessed', function () {
    expect(directiveElement.find('input#sourceAuthor').length).toBe(1);
    expect(directiveElement.find('input#publicationYear').length).toBe(1);
    expect(directiveElement.find('input#sourceTitle').length).toBe(1);
    expect(directiveElement.find('input#publicationTitle').length).toBe(1);
    expect(directiveElement.find('input#sourceUrl').length).toBe(1);
    expect(directiveElement.find('input#dateAccessed').length).toBe(1);
  });

  it('correctly generates a reference string for a website', function () {
    referenceController.author = 'Blogger, Q. R.';
    referenceController.publicationYear = 2016;
    referenceController.title = 'Article Title';
    referenceController.dateAccessed = new Date(2016, 1, 22);
    referenceController.url = 'http://myblog.com';

    referenceController.updateOutputString();

    expect(referenceController.outputString)
        .toBe('Blogger, Q. R. (2016). Article Title. Retrieved February 22, 2016, from http://myblog.com');
  });

  it('correctly generates a reference string for a journal article', function () {
    referenceController.author = 'Scientist, M. S.';
    referenceController.publicationYear = 2014;
    referenceController.title = 'Article Title';
    referenceController.publication = 'Journal Title';
    referenceController.dateAccessed = new Date(2016, 1, 22);
    referenceController.url = 'publisher-url.com';

    referenceController.updateOutputString();

    expect(referenceController.outputString).toBe(
        'Scientist, M. S. (2014). Article Title. <i>Journal Title</i>. Retrieved February 22, 2016, from publisher-url.com');
  });

  it('correctly generates a reference string for a book', function () {
    referenceController.author = 'Author, C. J.';
    referenceController.publicationYear = 2016;
    referenceController.publication = 'The Book Title';

    referenceController.updateOutputString();

    expect(referenceController.outputString).toBe('Author, C. J. (2016). <i>The Book Title</i>. ');
  });
});