var gulp = require('gulp');
var useref = require('gulp-useref');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-cssnano');
var templateCache = require('gulp-angular-templates');
var del = require('del');
var protractor = require('gulp-angular-protractor');
var server = require('gulp-express');
var KarmaServer = require('karma').Server;
var sass = require('gulp-sass');
var concat = require('gulp-concat');

var outputPath = 'build/webapp/';

gulp.task('bundle', function () {
  return gulp.src('app/index.html')
      .pipe(useref())
      .pipe(gulpif('*.js', uglify()))
      .pipe(gulpif('*.css', minifyCss()))
      .pipe(gulp.dest(outputPath));
});

gulp.task('copy-images', function () {
  return gulp.src('app/images/**/*')
      .pipe(gulp.dest(outputPath + 'images'));
});

gulp.task('angular-templates', function () {
  return gulp.src('components/**/*.html')
      .pipe(templateCache())
      .pipe(gulp.dest(outputPath));
});

gulp.task('clean', function () {
  return del(['build', 'release']);
});

gulp.task('_start-server', function () {
  server.run(['test/server.js']);
});

gulp.task('_test-functional', ['_start-server'], function () {
  return gulp.src(['./app/components/**/*.fn.spec.js'])
      .pipe(protractor({
        configFile: 'protractor.conf.js',
        autoStartStopServer: false
      }));
});

gulp.task('test-functional', ['_test-functional'], function () {
  server.stop();
});

gulp.task('test-unit', function (done) {
  new KarmaServer({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true,
    browsers: ['PhantomJS']
  }, done).start();
});

gulp.task('build-css', function () {
  return gulp.src('app/**/*.scss')
      .pipe(sass().on('error', sass.logError))
      .pipe(concat('aera.css'))
      .pipe(gulp.dest('app'));
});

gulp.task('run', function () {
  server.run(['test/server.js']);
  gulp.watch(['app/**/*.scss'], ['build-css']);
});

gulp.task('test', ['test-unit', 'test-functional']);
gulp.task('build', ['bundle', 'copy-images', 'angular-templates']);
gulp.task('default', ['build']);