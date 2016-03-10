'use strict';
/* global __dirname */

var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');

var app = express();

app.use('/aera', express.static(__dirname.replace('test', 'app')));
app.use('/node_modules', express.static(__dirname.replace('test', 'node_modules')));
app.use('/aera/data', express.static(__dirname + '/data'));
app.use(bodyParser.json({}));

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
    var chapter = {id: 4, title: 'Coal', pages: pages};
    res.status(200).send(chapter);
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

    var pageId = req.params.pageId % 3; // we only have 3 samples. just keep looping through.
    var dataDir = __dirname + '/data/page_' + pageId;

    try {
        fs.statSync(dataDir);
    } catch (ex) {
        res.status(500).send('Page not found');
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
        id: pageId,
        title: pages[pageId].title,
        summary: fs.readFileSync(dataDir + '/summary.txt', 'utf8'),
        imageUrl: 'data/page_' + pageId + '/' + imageFile,
        csvUrl: 'data/page_' + pageId + '/csv.csv'
    };

    res.status(200).send(page);
});

app.post('/api/page/save', function (req, res) {
    res.status(200).send({pageId: 4});
});
app.post('/api/page/save/list', function (req, res) {
    var pagesToUpdate = req.body.pageList;
    if (pagesToUpdate.length === 3) {
        res.status(500).send('Unable to update page order');
        return;
    }
    res.status(200).send();
});

app.get('/api/page/csv/:pageId', function (req, res) {
    res.status(200).send('data/page_0/csv.csv');
});
app.get('/api/page/image/:pageId', function (req, res) {
    res.status(200).send('data/page_0/image.png');
});

app.get('/api/reference/:pageId', function (req, res) {
    var fileName =  __dirname + '/data/page_' + (req.params.pageId % 3) + '/source.json';
    var json = JSON.parse(fs.readFileSync(fileName, 'utf8'));

    json.forEach(function (source) {
        if (source.dateAccessed) {
            source.dateAccessed = new Date();
        }
    });

    res.status(200).send(json);
});
app.post('/api/reference/save', function (req, res) {
    res.status(200).send();
});


app.listen(3000, function () {
    console.log('Express server listening on port 3000');
});

