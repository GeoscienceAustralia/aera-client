'use strict';

exports.config = {

  // The timeout for each script run on the browser. This should be longer
  // than the maximum time your application needs to stabilize between tasks.

  allScriptsTimeout: 30000,

  baseUrl: 'http://localhost:3000/',

  // Spec patterns are relative to the current working directory when
  // protractor is called.
  specs: ['app/components/**/*.fn.spec.js'],

  // A callback function called once protractor is ready and available, and
  // before the specs are executed
  // You can specify a file containing code to run by setting onPrepare to
  // the filename string.
  onPrepare: function () {
    var env = jasmine.getEnv();

    // At this point, global 'protractor' object will be set up, and jasmine
    // will be available.
    var jasmineReporters = require('jasmine-reporters');

    // defect with the reporter doesn't create directories if they don't exist.
    env.addReporter(new jasmineReporters.JUnitXmlReporter({
      savePath: 'test/',
      filePrefix: 'PROTRACTORresults'
    }));

    browser.setWindowSizeSmall = function () {
      browser.driver.manage().window().setSize(400, 480);
    };

    browser.setWindowSizeLarge = function () {
      browser.driver.manage().window().setSize(1280, 800);
    };
  },

  // Disable the warning message "You are using an unsupported command-line flag --ignore-certificate-errors. Stability
  // and security will suffer." when functional test run in Chrome
  capabilities: {
    browserName: 'chrome',
    'chromeOptions': {
      args: ['--test-type']
    }
  },

  // ----- The test framework -----
  //
  // Jasmine is fully supported as a test and assertion framework.
  // Mocha has limited beta support. You will need to include your own
  // assertion framework if working with mocha.
  framework: 'jasmine2'

};
