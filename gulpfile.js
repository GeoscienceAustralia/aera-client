var gulp = require('gulp');

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