'use strict';
/* global __dirname */

var express = require('express');

var app = express();

app.use('/aera', express.static(__dirname.replace('test', 'app')));
app.use('/node_modules', express.static(__dirname.replace('test', 'node_modules')));

app.all('/*', function (req, res, next) {
  res.set('Access-Control-Allow-Origin', req.headers.origin);
  next();
});

app.get('/', function (req, res) {
  res.status(200).send('Hello World');
});

app.get('/chapter', function (req, res) {
  var chapters = [{id: 1, title: 'The Phantom Menace'}, {id: 2, title: 'Attack of the Clones'},
    {id: 3, title: 'Revenge of the Sith'}, {id: 4, title: 'A New Hope'}, {id: 5, title: 'The Empire Strikes Back'},
    {id: 6, title: 'Return of the Jedi'}, {id: 7, title: 'The Force Awakens'}];
  res.status(200).send(chapters);
});

app.get('/chapter/:chapterId', function (req, res) {
  var pages = [{id: 1, title: 'Water farmed on Tatooine'}, {id: 2, title: 'Steel used in Death Star Construction'}];
  var chapter = {id: 4, title: 'A New Hope', pages: pages};
  res.status(200).send(chapter);
});

app.get('/page/:pageId', function (req, res) {
  var page = {
    id: 1,
    title: 'Number of Ewoks Killed',
    text: 'A large number of the native Ewoks were killed during the battle on Endor',
    imageUrl: 'http://pre12.deviantart.net/c3b4/th/pre/f/2012/214/7/c/futurama__bender_by_suzura-d59kq1p.png',
    datasetUrl: ''
  };
  res.status(200).send(page);
});

app.listen(3000, function () {
  console.log('Express server listening on port 3000');
});

