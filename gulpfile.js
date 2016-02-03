var gulp = require('gulp');
var useref = require('gulp-useref');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-cssnano');
var templateCache = require('gulp-angular-templates');
var del = require('del');
var protractor = require('gulp-angular-protractor');

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

gulp.task('testFunctional', function () {
  return gulp.src(['./app/components/**/*.fn.spec.js'])
      .pipe(protractor({
        configFile: 'protractor.conf.js',
        autoStartStopServer: true
      }));
});

gulp.task('build', ['bundle', 'copy-images', 'angular-templates']);
gulp.task('default', ['build']);