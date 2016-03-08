'use strict';

describe('Reference Input', function () {

    var $rootScope, directiveElement, controller, mockResources;
    beforeEach(function () {

        module('aera-common');
        module('aera-edit-page');
        module('components/reference/reference.html');

        inject(function ($compile, _$rootScope_) {

            $rootScope = _$rootScope_;

            directiveElement = angular.element('<aera-reference references="references"></aera-reference>');
            $rootScope.references = [];
            $compile(directiveElement)($rootScope);
            $rootScope.$digest();

            controller = directiveElement.controller('aeraReference');
        });

        mockResources = [{}, {}, {}];
        mockResources[0].author = 'Blogger, Q. R.';
        mockResources[0].publicationYear = 2016;
        mockResources[0].title = 'Article Title';
        mockResources[0].dateAccessed = new Date(2016, 1, 22);
        mockResources[0].url = 'http://myblog.com';
        mockResources[0].outputString = 'Blogger, Q. R. (2016). Article Title. Retrieved February 22, 2016, from http://myblog.com';

        mockResources[1].author = 'Scientist, M. S.';
        mockResources[1].publicationYear = 2014;
        mockResources[1].title = 'Article Title';
        mockResources[1].publication = 'Journal Title';
        mockResources[1].dateAccessed = new Date(2016, 1, 22);
        mockResources[1].url = 'publisher-url.com';
        mockResources[1].outputString = 'Scientist, M. S. (2014). Article Title. <i>Journal Title</i>. Retrieved February 22, 2016, from publisher-url.com';

        mockResources[2].author = 'Author, C. J.';
        mockResources[2].publicationYear = 2016;
        mockResources[2].publication = 'The Book Title';
        mockResources[2].dateAccessed = new Date(2015, 1, 23);
        mockResources[2].outputString = 'Author, C. J. (2016). <i>The Book Title</i>. ';
    });

    it('allows the user to input author, publication year, title, publication, url & date accessed', function () {
        expect(directiveElement.find('input#sourceAuthor').length).toBe(1);
        expect(directiveElement.find('input#publicationYear').length).toBe(1);
        expect(directiveElement.find('input#sourceTitle').length).toBe(1);
        expect(directiveElement.find('input#publicationTitle').length).toBe(1);
        expect(directiveElement.find('input#sourceUrl').length).toBe(1);
        expect(directiveElement.find('md-datepicker#dateAccessed').length).toBe(1);
    });

    it('correctly generates a reference string for a website', function () {
        controller.sources[0].author = mockResources[0].author;
        controller.sources[0].publicationYear = mockResources[0].publicationYear;
        controller.sources[0].title = mockResources[0].title;
        controller.sources[0].dateAccessed = mockResources[0].dateAccessed;
        controller.sources[0].url = mockResources[0].url;

        controller.updateOutputString(controller.sources[0]);

        expect(controller.sources[0].outputString).toBe(mockResources[0].outputString);
    });

    it('correctly generates a reference string for a journal article', function () {
        controller.sources[0].author = mockResources[1].author;
        controller.sources[0].publicationYear = mockResources[1].publicationYear;
        controller.sources[0].title = mockResources[1].title;
        controller.sources[0].publication = mockResources[1].publication;
        controller.sources[0].dateAccessed = mockResources[1].dateAccessed;
        controller.sources[0].url = mockResources[1].url;

        controller.updateOutputString(controller.sources[0]);

        expect(controller.sources[0].outputString).toBe(mockResources[1].outputString);
    });

    it('correctly generates a reference string for a book', function () {
        controller.sources[0].author = mockResources[2].author;
        controller.sources[0].publicationYear = mockResources[2].publicationYear;
        controller.sources[0].publication = mockResources[2].publication;

        controller.updateOutputString(controller.sources[0]);

        expect(controller.sources[0].outputString).toBe(mockResources[2].outputString);
    });

    it('updates the parent directive when the reference changes', function () {
        controller.sources[0].author = mockResources[2].author;
        controller.sources[0].publicationYear = mockResources[2].publicationYear;
        controller.sources[0].dateAccessed = mockResources[2].dateAccessed;

        controller.updateOutputString(controller.sources[0]);
        expect($rootScope.references).toBe(controller.sources);
    });

    it('allows a user to add multiple references', function () {
        controller.addSource();
        controller.addSource();
        expect(controller.sources.length).toBe(3);
    });
});