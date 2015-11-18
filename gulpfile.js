'use strict';

/*global require*/

var gulp = require('gulp'),
    rename = require('gulp-rename'),
    notify = require('gulp-notify'),
    uglify = require('gulp-uglify'),
    transpile = require('gulp-babel'),
    jshint = require('gulp-jshint');


gulp.task('build', function() {
    return gulp.src('multilang.js').pipe(
        jshint()
    ).pipe(
        jshint.reporter('default', { verbose: true})
    ).pipe(
        jshint.reporter('fail')
    ).pipe(
        transpile({presets: ['es2015']})
    ).pipe(
        uglify()
    ).pipe(
        rename({suffix: '.min'})
    ).pipe(
        gulp.dest('dist/')
    ).pipe(
        notify({ message: 'Build task complete' })
    );
});
