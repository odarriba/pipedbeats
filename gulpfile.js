'use strict';

var gulp = require('gulp'),
    del = require('del'),
    sass = require('gulp-sass'),
    minifyCss = require('gulp-minify-css'),
    inject = require('gulp-inject'),
    angularFilesort = require('gulp-angular-filesort'),
    browserSync = require('browser-sync'),
    es = require('event-stream');

var task = {};

var paths = {
  css : './assets/stylesheet/**/*.[scss,css]',
  js : './assets/javascript/**/*.js',
  images : './assets/image/**/*',
  app : './app/**/*'
};

var sassFiles = gulp.src('./assets/stylesheet/**/*.scss', {base: './assets/stylesheet'}),
    cssFiles = gulp.src('./assets/stylesheet/**/*.css', {base: './assets/stylesheet'}),
    jsFiles = gulp.src('./assets/javascript/**/*.js', {base: './assets/javascript'}),
    imgFiles = gulp.src('./assets/image/**/*', {base: './assets/image'}),
    appFiles = gulp.src('./app/**/*', {base: './app'});

function compileSass(){
  return sassFiles.pipe(sass().on('error', sass.logError));
}

// Task to clean the assets folder
gulp.task('clean:build', function () {
  return del('./build/assets/*');
});

gulp.task('clean:dist', function () {
  return del('./dist/assets/*');
});


////////////////////////
//    STYLESHEETS     //
////////////////////////

// Task to compile the SASS files
gulp.task('css:build', ['clean:build'], task.css = function() {
  del('./build/assets/**/*.css');
  return es.merge(compileSass(), cssFiles).pipe(gulp.dest('./build/assets'));
});

// Task to compile and minify the SASS files with previous cleaning
gulp.task('css:dist', ['clean:dist'], function() {
  del('./dist/assets/**/*.css');
  return es.merge(compileSass(), cssFiles).pipe(minifyCss({compatibility: 'ie8'}))
    .pipe(gulp.dest('./dist/assets/'));
});


////////////////////////
//       IMAGES       //
////////////////////////

// Copy all the imgs
gulp.task('img:build', ['clean:build'], task.img = function() {
  return imgFiles.pipe(gulp.dest('./build/assets/'));
});

// Copy all the imgs to dist
gulp.task('img:dist', ['clean:dist'], function() {
  return imgFiles.pipe(gulp.dest('./dist/assets/'));
});

////////////////////////
//    JAVASCRIPTS     //
////////////////////////

// Copy all the javascripts
gulp.task('js:build', ['clean:build'], task.js = function() {
  return jsFiles.pipe(gulp.dest('./build/assets/'));
});

// Copy all the javascripts to dist
gulp.task('js:dist', ['clean:dist'], function() {
  return jsFiles.pipe(gulp.dest('./dist/assets/'));
});

////////////////////////
//    APPLICATION     //
////////////////////////

// Copy all the javascripts
gulp.task('app:build', ['clean:build'], task.app = function() {
  return appFiles.pipe(gulp.dest('./build/'));
});

// Copy all the javascripts to dist
gulp.task('app:dist', ['clean:dist'], function() {
  return appFiles.pipe(gulp.dest('./dist/'));
});

////////////////////////
//     INJECTION      //
////////////////////////

// Task to inject the files after compiling the assets during build
gulp.task('inject:build', ['css:build', 'js:build', 'img:build', 'app:build'], task.inject = function() {
  gulp.src('./build/index.html')
    .pipe(inject(es.merge(
      gulp.src('./build/assets/**/*.css', {read: false}),
      gulp.src('./build/**/*.js').pipe(angularFilesort())
    ), {
      starttag : "<!-- {{ext}} files -->",
      endtag: "<!-- end {{ext}} files -->",
      relative: true
    }))
    .pipe(gulp.dest('./build/'));
});

// Task to inject the files after compiling and minifying the assets
gulp.task('inject:dist', ['css:dist', 'js:dist', 'img:dist', 'app:dist'], function() {
  gulp.src('./dist/index.html')
    .pipe(inject(es.merge(
      gulp.src('./dist/assets/**/*.css', {read: false}),
      gulp.src('./dist/**/*.js').pipe(angularFilesort())
    ), {
      starttag : "<!-- {{ext}} files -->",
      endtag: "<!-- end {{ext}} files -->",
      relative: true
    }))
    .pipe(gulp.dest('./dist/'));
});

// Build and distribution pipelines
gulp.task('build', ['clean:build', 'css:build', 'img:build', 'inject:build']);
gulp.task('dist', ['clean:dist', 'css:dist', 'img:dist', 'inject:dist']);

// Watch tasks
gulp.task('watch', ['build'], task.watch = function() {
  gulp.watch(paths.css, ['build']);
  gulp.watch(paths.js, ['build']);
  gulp.watch(paths.img, ['img:build']);
  gulp.watch(paths.app, ['build']);
});

// Build and serve the output from the build
gulp.task('serve', ['build'], function() {
  browserSync({
    notify: false,
    logPrefix: 'Server',
    server: {
      baseDir: './build'
    }
  });

  gulp.watch(paths.css, ['serve:rebuild']);
  gulp.watch(paths.js, ['serve:rebuild']);
  gulp.watch(paths.img, ['img:build']);
  gulp.watch(paths.app, ['serve:rebuild']);
});

// Build and serve the output from the build
gulp.task('serve:rebuild', ['build'], function() {
  browserSync.reload();
});

// Default tasks
gulp.task('default', ['build']);
