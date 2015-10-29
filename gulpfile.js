'use strict';

/*global require*/

var gulp = require('gulp'),
    rename = require('gulp-rename'),
    notify = require('gulp-notify'),
    uglify = require('gulp-uglify');


gulp.task('build', function() {
    return gulp.src('multilang.js').pipe(
        uglify()
    ).pipe(
        rename({suffix: '.min'})
    ).pipe(
        gulp.dest('dist/')
    ).pipe(
        notify({ message: 'Build task complete' })
    );
});
