const gulp = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const debug = require('gulp-debug');
const del = require('del');
const browserSync = require('browser-sync').create();
const posthtml = require('gulp-posthtml');
const flatten = require('gulp-flatten');
const include = require('gulp-file-include');

gulp.task('styles', () => {
  return gulp
    .src('./src/style.scss')
    .pipe(debug({ title: 'sass compilation' }))
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./public/css'));
});

gulp.task('html', () => {
  const beautify = require('posthtml-beautify');
  return gulp
    .src('./src/*.html')
    .pipe(debug({ title: 'html processing' }))
    .pipe(
      include({
        prefix: '@@',
        basepath: '@file'
      })
    )
    .pipe(posthtml([beautify()]))
    .pipe(gulp.dest('./public'));
});

gulp.task('assets', () => {
  return gulp
    .src('./src/assets/**/*.*', { since: gulp.lastRun('assets') })
    .pipe(debug({ title: 'assets pricessing' }))
    .pipe(flatten())
    .pipe(gulp.dest('./public/assets'));
});

gulp.task('modules:assets', () => {
  return gulp
    .src('./src/components/**/*.{png,svg}', {
      since: gulp.lastRun('modules:assets')
    })
    .pipe(debug({ title: 'modules:assets processing' }))
    .pipe(flatten())
    .pipe(gulp.dest('./public/assets/'));
});

gulp.task('clean', () => {
  return del('./public');
});

gulp.task('watch', () => {
  gulp.watch('./src/**/*.html', gulp.series('html'));
  gulp.watch('./src/**/*.*', gulp.series('styles'));
  gulp.watch('./src/assets/*.*', gulp.series('assets'));
  gulp.watch('./src/components/**/*.{png,svg}', gulp.series('modules:assets'));
});

gulp.task('serve', () => {
  browserSync.init({
    server: './public'
  });
  browserSync.watch('./public/**/*.*').on('change', browserSync.reload);
});

gulp.task(
  'build',
  gulp.series(gulp.parallel('html', 'styles', 'modules:assets', 'assets'))
);

gulp.task('dev', gulp.series('build', gulp.parallel('watch', 'serve')));
