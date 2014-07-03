var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var refresh = require('gulp-livereload');
var lrserver = require('tiny-lr');
var express = require('express');
var livereload = require('connect-livereload');

var paths = {
  sass: ['./scss/*.scss'],
  js: ['./www/js/**/*.js'],
  html: ['./www/templates/**/*.html','./www/index.html']
};
var livereloadport = 35729;
var lrport = 35729;
var serverport = 5000;

//We only configure the server here and start it only when running the watch task
var server = express();
//Add livereload middleware before static-middleware
//server.use(livereload({
  //  port: livereloadport
//}));
server.use(express.static('./www'));

//build tasks

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass())
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .pipe(refresh(lrserver))
    .on('end', done);
});

//Task for processing js with browserify
gulp.task('browserify', function(){
    gulp.src('js/*.js',{read: false})
      //  .pipe(browserify())
      //  .pipe(concat('bundle.js'))
      //  .pipe(gulp.dest('build'))
        .pipe(refresh(lrserver));
});

//Task for moving html-files to the build-dir
//added as a convenience to make sure this gulpfile works without much modification
gulp.task('html', function(){
    gulp.src('views/*.html',{read: false})
      //  .pipe(gulp.dest('build'))
        .pipe(refresh(lrserver));
});

//Convenience task for running a one-off build
gulp.task('build',['html', 'browserify','sass']);


//serve task

gulp.task('serve', function() {
    //Set up your static fileserver, which serves files in the www dir
    server.listen(serverport);

    //Set up your livereload server
 //   lrserver.listen(lrport);
   // lrserver().listen(lrport, function() {
     //   console.log('... Listening on %s ...', lrport);
    //})
});

gulp.task('watch', function() {
    lrserver().listen(lrport, function(err) {
        if (err) {
            return gutil.log(err);
        }
        //Add watching on sass-files
        gulp.watch(paths.sass, ['sass']);

        //Add watching on js-files
        gulp.watch(paths.js, ['browserify']);

        //Add watching on html-files
        gulp.watch(paths.html, ['html']);

        gutil.log('Watching source files for changes... Press ' + gutil.colors.cyan('CTRL + C') + ' to stop.');
    });
});


//default task

gulp.task('default', ['build', 'serve', 'watch']);

//install tasks

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});
