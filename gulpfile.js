'use strict';

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    mainBowerFiles = require('main-bower-files'),
    concat = require('gulp-concat'),
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
  app : './app/**/*',
  bower: ['bower.json', '.bowerrc']
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
var assetsPath = {
      css : 'assets/css/',
      js : 'assets/js/',
      fonts : 'assets/fonts/',
      other : 'assets/'
    },
    buildPath = './build/',
    distPath = './dist/';

// Common processing functions used by the tasks
var processes = {
  clean : function(path) {
    return gulp.src(path, {read: false}).pipe(clean());
  },
  buildCss : function (path) {
    return es.merge(gulp.src(inputFiles.scss).pipe(sass().on('error', sass.logError)), gulp.src(inputFiles.css))
            .pipe(gulp.dest(path+assetsPath.css));
  },
  buildJs : function (path) {
    return gulp.src(inputFiles.js)
            .pipe(gulp.dest(path+assetsPath.js));
  },
  buildOther : function(path) {
    return gulp.src(inputFiles.other)
            .pipe(gulp.dest(path+assetsPath.other));
  },
  buildApp : function(path) {
    return gulp.src(inputFiles.app).pipe(gulp.dest(path));
  },
  buildVendors : function(path) {
    // Compile the JS
    gulp.src(mainBowerFiles({filter: '**/*.js'}))
      .pipe(concat('vendors.js'))
      .pipe(gulp.dest(path+assetsPath.js));

    // Compile the SASS and CSS
    es.merge(gulp.src(mainBowerFiles({filter: '**/*.css'})), gulp.src(mainBowerFiles({filter: '**/*.scss'})).pipe(sass().on('error', sass.logError)))
        .pipe(concat('vendors.css'))
        .pipe(gulp.dest(path+assetsPath.css));

    // Copy the fonts of FontAwesome
    return gulp.src(mainBowerFiles({filter: '**/fonts/*'}))
      .pipe(gulp.dest(path+assetsPath.fonts));
  },
  inject : function(path) {
    return gulp.src(path+'/index.html')
      .pipe(inject(es.merge(gulp.src([path+'/**/*.css', '!'+path+'/**/vendors.*']), gulp.src([path+'/**/*.js', '!'+path+'/**/vendors.*']).pipe(angularFilesort())), {
        starttag : "<!-- {{ext}} files -->",
        endtag: "<!-- end {{ext}} files -->",
        relative: true
      }))
      .pipe(inject(gulp.src(path+'/**/vendors.*', {read:false}),
      {
        starttag : "<!-- vendor {{ext}} files -->",
        endtag: "<!-- end vendor {{ext}} files -->",
        relative: true
      }))
      .pipe(gulp.dest(path));
  }
};


gulp.task('vendor:build', ['clean:build'], function() {
  return processes.buildVendors(buildPath);
});

// CLEAN TASKS
gulp.task('clean:build', function(){
  return processes.clean(buildPath);
});
gulp.task('clean:dist', function(){
  return processes.clean(distPath);
});

// CSS TASKS
gulp.task('css:build', ['clean:build'], function(){
  return processes.buildCss(buildPath);
});
gulp.task('css:watch', function(){
  return processes.buildCss(buildPath).pipe(browserSync.stream());
});
gulp.task('css:dist', ['clean:dist'], function(){
  return processes.buildCss(distPath);
});

// JS TASKS
gulp.task('js:build', ['clean:build'], function(){
  return processes.buildJs(buildPath);
});
gulp.task('js:watch', function(){
  processes.buildJs(buildPath);
  return browserSync.reload();
});
gulp.task('js:dist', ['clean:dist'], function(){
  return processes.buildJs(distPath);
});

// IMG TASKS
gulp.task('other:build', ['clean:build'], function(){
  return processes.buildOther(buildPath);
});
gulp.task('other:watch', function(){
  processes.buildOther(buildPath);
  return browserSync.reload();
});
gulp.task('other:dist', ['clean:dist'], function(){
  return processes.buildOther(distPath);
});

// APP TASKS
gulp.task('app:build', ['clean:build'], function(){
  return processes.buildApp(buildPath);
});
gulp.task('app:watch', function(){
  // This task doesn't reload because it's done in the 'inject:watch' task.
  return processes.buildApp(buildPath);
});
gulp.task('app:dist', ['clean:dist'], function(){
  return processes.buildApp(distPath);
});

// INJECT DEPENDENCIES
gulp.task('inject:build', ['css:build', 'js:build', 'other:build', 'vendor:build', 'app:build'], function(){
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
gulp.task('build', ['clean:build', 'vendor:build', 'css:build', 'js:build', 'other:build', 'app:build', 'inject:build']);
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
