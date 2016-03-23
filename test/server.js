'use strict';
/* global __dirname */

var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');
var multer = require('multer');

var app = express();
var multipart = multer();

app.use('/aera', express.static(__dirname.replace('test', 'app')));
app.use('/node_modules', express.static(__dirname.replace('test', 'node_modules')));
app.use('/aera/data', express.static(__dirname + '/data'));
app.use(bodyParser.json({}));

var pageIds = {
    pageNotFound: '99',
    slowPage: '98',
    csvUrlNotFound: '97',
    imageUrlNotFound: '96',
    sourcesNotFound: '95',
    slowSources: '94'
};

var pages = [{pageId: 0, pageNumber: 0, title: 'Summary'},
    {pageId: 1, pageNumber: 1, title: 'Identified/Demonstrated Resources'},
    {pageId: 2, pageNumber: 2, title: 'Prospective Resources'},
    {pageId: 3, pageNumber: 3, title: 'Australian Market'},
    {pageId: 4, pageNumber: 4, title: 'World Resources'},
    {pageId: 5, pageNumber: 5, title: 'World Market'},
    {pageId: 6, pageNumber: 6, title: 'Outlook'}];

app.all('/*', function (req, res, next) {
    res.set('Access-Control-Allow-Origin', req.headers.origin);
    next();
});

app.get('/api', function (req, res) {
    res.status(200).send('Hello World');
});

app.get('/api/chapter/:chapterId', function (req, res) {
    if (req.params.chapterId === '5') {
        res.status(500).send('Unable to retrieve chapter page listing');
        return;
    }

    var chapter = {id: 4, title: 'Coal', pages: pages};

    var delay = 0;
    if (req.params.chapterId === '6')
        delay = 10000;

    setTimeout(function () {res.status(200).send(chapter);}, delay);
});

app.get('/api/chapter', function (req, res) {
    var chapters = [{chapterId: 0, title: 'Introduction/Executive Summary'}, {chapterId: 1, title: 'Australia\'s Energy Resources and Market'},
        {chapterId: 2, title: 'Oil'}, {chapterId: 3, title: 'Gas'}, {chapterId: 4, title: 'Coal'},
        {chapterId: 5, title: 'Uranium and Thorium'}, {chapterId: 6, title: 'Geothermal'}, {chapterId: 7, title: 'Hydro'},
        {chapterId: 8, title: 'Wind'}, {chapterId: 9, title: 'Solar'}, {chapterId: 10, title: 'Ocean'},
        {chapterId: 11, title: 'Bioenergy'}, {chapterId: 12, title: 'Appendices'}];
    res.status(200).send(chapters);
});

app.get('/api/page/:pageId', function (req, res) {

    if (req.params.pageId === pageIds.pageNotFound) {
        res.status(500).send({error: 'Could not find page'});
        return;
    }

    var delay = 0;
    if (req.params.pageId === pageIds.slowPage) {
        delay = 10000;
    }

    var pageId = req.params.pageId % 3; // we only have 3 samples. just keep looping through.
    var dataDir = __dirname + '/data/page_' + pageId;

    try {
        fs.statSync(dataDir);
    } catch (ex) {
        res.status(500).send({error: 'Could not find page'});
        return;
    }

    var files = fs.readdirSync(dataDir);
    var imageFile = 'image.png';
    files.some(function (fileName) {
        if (fileName.indexOf('image') > -1) {
            imageFile = fileName;
            return true;
        }
    });

    var page = {
        pageId: Number.parseInt(req.params.pageId),
        pageNumber: pageId,
        title: pages[pageId].title,
        summary: fs.readFileSync(dataDir + '/summary.txt', 'utf8'),
        imageUrlRequest: 'data/page_' + pageId + '/' + imageFile,
        csvUrlRequest: 'data/page_' + pageId + '/csv.csv'
    };

    setTimeout(function () { res.status(200).send(page); }, delay);

});

app.post('/api/page/save', multipart.array(), function (req, res) {
    if (req.body.title === 'Error') {
        res.status(500).send({error: 'Could not save page'});
        return;
    }

    var pageId = req.body.pageId ? Number.parseInt(req.body.pageId) : 4;

    var delay = 0;
    if (req.body.title === 'Slow') {
        delay = 10000;
    }

    setTimeout(function () {
        res.status(200).send({pageId: pageId});
    }, delay);

});
app.post('/api/page/save/list', function (req, res) {
    var pagesToUpdate = req.body.pageList, delay = 0;

    if (pagesToUpdate.length === 3) {
        res.status(500).send({error: 'Could not update page order'});
        return;
    } else if (pagesToUpdate.length === 2) {
        delay = 10000;
    }

    setTimeout(function () {res.status(200).send(req.body.pageList);}, delay);
});

app.get('/api/page/csv/:pageId', function (req, res) {
    if (req.params.pageId === pageIds.csvUrlNotFound) {
        res.status(500).send({warning: 'Could not retrieve URL for CSV file'});
        return;
    }
    res.status(200).send('data/page_0/csv.csv');
});
app.get('/api/page/image/:pageId', function (req, res) {
    if (req.params.pageId === pageIds.imageUrlNotFound) {
        res.status(500).send({warning: 'Could not retrieve URL for image file'});
        return;
    }
    res.status(200).send('data/page_0/image.png');
});

app.get('/api/source/page/:pageId', function (req, res) {
    if (req.params.pageId === pageIds.sourcesNotFound) {
        res.status(500).send({error: 'Could retrieve sources for page'});
        return;
    }

    var delay = 0;
    if (req.params.pageId === pageIds.slowSources) {
        delay = 10000;
    }

    var fileName =  __dirname + '/data/page_' + (req.params.pageId % 3) + '/source.json';
    var json = JSON.parse(fs.readFileSync(fileName, 'utf8'));

    json.forEach(function (source) {
        if (source.dateAccessed) {
            source.dateAccessed = '2016-03-15';
        }
    });

    setTimeout(function () { res.status(200).send(json); }, delay);

});
app.post('/api/source/save', function (req, res) {

    var delay = 0;

    if (req.body.sources.some(function (source) {
        if (source.title === 'Error') {
            res.status(500).send({error: 'Could not save sources'});
            return true;
        } else if (source.title === 'Slow') {
            delay = 10000;
            return false;
        }
    }))
        return;

    setTimeout(function () {
        res.status(200).send(); },
            delay);
});


app.listen(3000, function () {
    console.log('Express server listening on port 3000');
});

