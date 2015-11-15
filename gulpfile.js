'use strict';

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    minifyCss = require('gulp-minify-css'),
    inject = require('gulp-inject'),
    angularFilesort = require('gulp-angular-filesort'),
    clean = require('gulp-clean'),
    browserSync = require('browser-sync'),
    es = require('event-stream');

// Input files selection paths
var inputFiles = {
  scss : './assets/stylesheet/*.scss',
  css : './assets/stylesheet/**/*.css',
  js : './assets/javascript/**/*.js',
  other : './assets/other/**/*',
  app : './app/**/*'
};

// Watch files selection paths
var watchFiles = {
  scss : './assets/stylesheet/**/*.scss',
  css : './assets/stylesheet/**/*.css',
  js : './assets/javascript/**/*.js',
  other : './assets/other/**/*',
  app : './app/**/*'
};

// Paths used by Gulp
var assetsPath = 'assets',
    buildPath = './build/',
    distPath = './dist/';

// Common processing functions used by the tasks
var processes = {
  clean : function(path) {
    return gulp.src(path, {read: false}).pipe(clean());
  },
  css : function (path, minify) {
    minify = minify || false;

    var input = es.merge(gulp.src(inputFiles.scss).pipe(sass().on('error', sass.logError)), gulp.src(inputFiles.css));

    if (minify === true) {
      input = input.pipe(minifyCss());
    }

    return input.pipe(gulp.dest(path+assetsPath));
  },
  js : function (path) {
    return gulp.src(inputFiles.js).pipe(gulp.dest(path+assetsPath));
  },
  other : function(path) {
    return gulp.src(inputFiles.other).pipe(gulp.dest(path+assetsPath));
  },
  app : function(path) {
    return gulp.src(inputFiles.app).pipe(gulp.dest(path));
  },
  inject : function(path) {
    gulp.src(path+'/index.html')
      .pipe(inject(es.merge(
        gulp.src(path+assetsPath+'/**/*.css'),
        gulp.src(path+'/**/*.js').pipe(angularFilesort())
      ), {
        starttag : "<!-- {{ext}} files -->",
        endtag: "<!-- end {{ext}} files -->",
        relative: true
      }))
      .pipe(gulp.dest(path));
  }
};

// CLEAN TASKS
gulp.task('clean:build', function(){
  return processes.clean(buildPath);
});
gulp.task('clean:dist', function(){
  return processes.clean(distPath);
});

// CSS TASKS
gulp.task('css:build', ['clean:build'], function(){
  return processes.css(buildPath, false);
});
gulp.task('css:watch', function(){
  return processes.css(buildPath).pipe(browserSync.stream());
});
gulp.task('css:dist', ['clean:dist'], function(){
  return processes.css(distPath, true);
});

// JS TASKS
gulp.task('js:build', ['clean:build'], function(){
  return processes.js(buildPath);
});
gulp.task('js:watch', function(){
  processes.js(buildPath);
  return browserSync.reload();
});
gulp.task('js:dist', ['clean:dist'], function(){
  return processes.js(distPath);
});

// IMG TASKS
gulp.task('other:build', ['clean:build'], function(){
  return processes.other(buildPath);
});
gulp.task('other:watch', function(){
  processes.other(buildPath);
  return browserSync.reload();
});
gulp.task('other:dist', ['clean:dist'], function(){
  return processes.other(distPath);
});

// APP TASKS
gulp.task('app:build', ['clean:build'], function(){
  return processes.app(buildPath);
});
gulp.task('app:watch', function(){
  // This task doesn't reload because it's done in the 'inject:watch' task.
  return processes.app(buildPath);
});
gulp.task('app:dist', ['clean:dist'], function(){
  return processes.app(distPath);
});

// INJECT DEPENDENCIES
gulp.task('inject:build', ['css:build', 'js:build', 'other:build', 'app:build'], function(){
  return processes.inject(buildPath);
});
gulp.task('inject:watch', ['app:watch'], function(){
  processes.inject(buildPath);
  return browserSync.reload();
});
gulp.task('inject:dist', ['css:dist', 'js:dist', 'other:dist', 'app:dist'], function(){
  return processes.inject(distPath);
});

// BUILD TASKS
gulp.task('build', ['clean:build', 'css:build', 'js:build', 'other:build', 'app:build', 'inject:build']);
gulp.task('dist', ['clean:dist', 'css:dist', 'js:dist', 'other:dist', 'app:dist', 'inject:dist']);

// WATCH TASK
gulp.task('watch', ['build'], function() {
  gulp.watch([watchFiles.scss, watchFiles.css], ['css:watch']);
  gulp.watch(watchFiles.js, ['js:watch']);
  gulp.watch(watchFiles.other, ['other:watch']);
  gulp.watch(watchFiles.app, ['app:watch', 'inject:watch']);
});

// SERVE TASK
gulp.task('serve', ['build', 'watch'], function() {
  browserSync({
    notify: false,
    logPrefix: 'Server',
    server: {
      baseDir: './build'
    }
  });
});

// DEFAULT TASK
gulp.task('default', ['build', 'watch', 'serve']);
