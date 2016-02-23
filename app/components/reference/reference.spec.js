'use strict';

describe('Reference Input', function () {

    var directiveElement, referenceController, editPageController, mockResource;
    beforeEach(function () {

        module('aera-common');
        module('aera-edit-page');
        module('components/edit-page/editPage.html');
        module('components/reference/reference.html');

        inject(function ($compile, $rootScope) {
            var parentDirectiveElement = $compile('<aera-edit-page></aera-edit-page>')($rootScope);
            $rootScope.$digest();
            editPageController = parentDirectiveElement.controller('aeraEditPage');

            directiveElement = parentDirectiveElement.find('aera-reference');
            referenceController = directiveElement.controller('aeraReference');
        });

        mockResource = {
            author: 'me',
            publicationYear: 2008,
            dateAccessed: new Date(2015, 1, 23),
        };

        editPageController = {};
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

    it('updates the parent directive when the reference changes', function () {
        referenceController.author = mockResource.author;
        referenceController.publicationYear = mockResource.publicationYear;
        referenceController.dateAccessed = mockResource.dateAccessed;

        referenceController.updateOutputString();
        expect(editPageController.resource).toBe(mockResource);
    })
});