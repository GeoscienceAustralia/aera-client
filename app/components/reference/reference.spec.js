'use strict';

describe('Reference Input', function () {

    var directiveElement, controller, editPageController, mockResource;
    beforeEach(function () {

        module('aera-common');
        module('aera-edit-page');
        module('components/reference/reference.html');

        editPageController = {
            setReference: function (reference) {
                editPageController.reference = reference;
            }
        };

        inject(function ($compile, $rootScope) {

            var parentElement = angular.element('<div><aera-reference></aera-reference></div>');
            parentElement.data('$aeraEditPageController', editPageController);
            $compile(parentElement)($rootScope);

            directiveElement = parentElement.find('aera-reference');
            $rootScope.$digest();

            controller = directiveElement.controller('aeraReference');
            controller.reference = {};
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
        controller.reference.author = 'Blogger, Q. R.';
        controller.reference.publicationYear = 2016;
        controller.reference.title = 'Article Title';
        controller.reference.dateAccessed = new Date(2016, 1, 22);
        controller.reference.url = 'http://myblog.com';

        controller.updateOutputString();

        expect(controller.outputString)
                .toBe('Blogger, Q. R. (2016). Article Title. Retrieved February 22, 2016, from http://myblog.com');
    });

    it('correctly generates a reference string for a journal article', function () {
        controller.reference.author = 'Scientist, M. S.';
        controller.reference.publicationYear = 2014;
        controller.reference.title = 'Article Title';
        controller.reference.publication = 'Journal Title';
        controller.reference.dateAccessed = new Date(2016, 1, 22);
        controller.reference.url = 'publisher-url.com';

        controller.updateOutputString();

        expect(controller.outputString).toBe(
                'Scientist, M. S. (2014). Article Title. <i>Journal Title</i>. Retrieved February 22, 2016, from publisher-url.com');
    });

    it('correctly generates a reference string for a book', function () {
        controller.reference.author = 'Author, C. J.';
        controller.reference.publicationYear = 2016;
        controller.reference.publication = 'The Book Title';

        controller.updateOutputString();

        expect(controller.outputString).toBe('Author, C. J. (2016). <i>The Book Title</i>. ');
    });

    it('updates the parent directive when the reference changes', function () {
        controller.reference.author = mockResource.author;
        controller.reference.publicationYear = mockResource.publicationYear;
        controller.reference.dateAccessed = mockResource.dateAccessed;

        controller.updateOutputString();
        expect(editPageController.reference).toEqual(mockResource);
    })
});