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

app.get('/chapter/:chapterId', function (req, res) {
  var pages = [{id: 0, title: 'Summary'},
                {id: 1, title: 'Identified/Demonstrated Resources'},
                {id: 1, title: 'Prospective Resources'},
                {id: 1, title: 'Australian Market'},
                {id: 1, title: 'World Resources'},
                {id: 1, title: 'World Market'},
                {id: 1, title: 'Outlook'}];
  var chapter = {id: 4, title: 'Coal', pages: pages};
  res.status(200).send(chapter);
});

app.get('/chapter', function (req, res) {
  var chapters = [{id: 0, title: 'Introduction/Executive Summary'}, {id: 1, title: 'Australia\'s Energy Resources and Market'},
    {id: 2, title: 'Oil'}, {id: 3, title: 'Gas'}, {id: 4, title: 'Coal'},
    {id: 5, title: 'Uranium and Thorium'}, {id: 6, title: 'Geothermal'}, {id: 7, title: 'Hydro'},
    {id: 8, title: 'Wind'}, {id: 9, title: 'Solar'}, {id: 10, title: 'Ocean'},
    {id: 11, title: 'Bioenergy'}, {id: 12, title: 'Appendices'}];
  res.status(200).send(chapters);
});

app.get('/page/:pageId', function (req, res) {
  var page0 = {
    id: 0,
    title: 'Water farmed on Tatooine',
    text: 'Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts. Separated they live in Bookmarksgrove right at the coast of the Semantics, a large language ocean. A small river named Duden flows by their place and supplies it with the necessary regelialia. It is a paradisematic country, in which roasted parts of sentences fly into your mouth. Even the all-powerful Pointing has no control about the blind texts it is an almost unorthographic life One day however a small line of blind text by the name of Lorem Ipsum decided to leave for the far World of Grammar. The Big Oxmox advised her not to do so, because there were thousands of bad Commas, wild Question Marks and devious Semikoli, but the Little Blind Text didn’t listen. She packed her seven versalia, put her initial into the belt and made herself on the way. When she reached the first hills of the Italic Mountains, she had a last view back on the skyline of her hometown Bookmarksgrove, the headline of Alphabet Village and the subline of her own road, the Line Lane. Pityful a rethoric question ran over her cheek, then',
    imageUrl: 'http://icons.iconseeker.com/png/fullsize/futurama-vol-1/bender-1.png',
    datasetUrl: '',
    reference: 'Australian Bureau of Statistics (2015), ABS Cat. No. 6291.0.55.003, Labour Force, Australia, Detailed, Quarterly, Feb 2015, table 4'
  };
  var page1 = {
    id: 1,
    title: 'Steel used in Death Star Construction',
    text: "One morning, when Gregor Samsa woke from troubled dreams, he found himself transformed in his bed into a horrible vermin. He lay on his armour-like back, and if he lifted his head a little he could see his brown belly, slightly domed and divided by arches into stiff sections. The bedding was hardly able to cover it and seemed ready to slide off any moment. His many legs, pitifully thin compared with the size of the rest of him, waved about helplessly as he looked. \"What's happened to me?\" he thought. It wasn't a dream. His room, a proper human room although a little too small, lay peacefully between its four familiar walls. A collection of textile samples lay spread out on the table - Samsa was a travelling salesman - and above it there hung a picture that he had recently cut out of an illustrated magazine and housed in a nice, gilded frame. It showed a lady fitted out with a fur hat and fur boa who sat upright, raising a heavy fur muff that covered the whole of her lower arm towards the viewer. Gregor then turned to look out the window at the dull weather. Drops",
    imageUrl: 'http://www.veryicon.com/icon/png/Movie%20%26%20TV/Futurama%20Vol.%201/Leela.png',
    datasetUrl: '',
    reference: 'IP Australia (2014), Overview of the Intellectual Property Government Open Data, IP Australia Economic Research Paper 02.'
  };
  var pages = [page0, page1];
  res.status(200).send(pages[req.params.pageId]);
});

app.listen(3000, function () {
  console.log('Express server listening on port 3000');
});

