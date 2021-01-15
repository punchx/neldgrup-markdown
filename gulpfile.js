import gulp from 'gulp';
import sass from 'gulp-sass';
import sourcemaps from 'gulp-sourcemaps';
import debug from 'gulp-debug';
import del from 'del';
import browserSync from 'browser-sync';
import posthtml from 'gulp-posthtml';
import flatten from 'gulp-flatten';
import include from 'gulp-file-include';
import beautify from 'posthtml-beautify';
import autoprefixer from 'gulp-autoprefixer';

browserSync.create();

export const styles = () => {
  return gulp
    .src('./src/style.scss')
    .pipe(debug({ title: 'sass compilation' }))
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./public/css'));
}

export const html = () => {
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
}

export const assets = () => {
  return gulp
    .src('./src/assets/**/*.*', { since: gulp.lastRun('assets') })
    .pipe(debug({ title: 'assets pricessing' }))
    .pipe(flatten())
    .pipe(gulp.dest('./public/assets'));
}

export const modulesAssets = () => {
  return gulp
    .src('./src/components/**/*.{png,svg}', {
      since: gulp.lastRun('modulesAssets')
    })
    .pipe(debug({ title: 'moduleAssets processing' }))
    .pipe(flatten())
    .pipe(gulp.dest('./public/assets/'));
}

export const clean = () => {
  return del('./public');
}

export const watch =  () => {
  gulp.watch('./src/**/*.html', gulp.series(html));
  gulp.watch('./src/**/*.*', gulp.series(styles));
  gulp.watch('./src/assets/*.*', gulp.series(assets));
  gulp.watch('./src/components/**/*.{png,svg}', gulp.series(modulesAssets));
}

export const serve =  () => {
  browserSync.init({
    server: './public'
  });
  browserSync.watch('./public/**/*.*').on('change', browserSync.reload);
}

export const build = gulp.series(gulp.parallel(html, styles, modulesAssets, assets));
export default gulp.series(build, gulp.parallel(watch, serve));
