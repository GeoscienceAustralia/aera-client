module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath : '.',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks : [ 'jasmine' ],

    // list of files / patterns to load in the browser
    files : [
      'node_modules/jquery/dist/jquery.js', // include jquery so we can select and click things in tests
      'node_modules/angular/angular.js',
      'node_modules/angular-ui-router/release/angular-ui-router.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'node_modules/angular-sanitize/angular-sanitize.js',
      'node_modules/phantomjs-function-bind-polyfill/index.js',
      'app/components/**/*.html',
      'app/components/**/*.js' ],

    // list of files to exclude
    exclude : ['app/components/**/*.fn.spec.js', 'app/components/**/*.page.js'],

    reporters : [ 'progress' ],

    htmlReporter : {
      outputDir : 'karma-reports'
    },

    // web server port
    port : 9876,

    // enable / disable colors in the output (reporters and logs)
    colors : true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel : config.LOG_DEBUG || config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch : true,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers : [ 'Chrome' ],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun : false,

    preprocessors: {
      'app/components/**/*.html': 'ng-html2js'
    },
    ngHtml2JsPreprocessor: {
      stripPrefix: 'app/'
    },

    plugins : [ 'karma-jasmine',
      'karma-chrome-launcher',
      'karma-junit-reporter',
      'karma-phantomjs-launcher',
      'karma-ng-html2js-preprocessor']
  });
};
