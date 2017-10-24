'use strict';

var gulp = require('gulp');
var sass = require('gulp-ruby-sass');
var sourcemaps = require('gulp-sourcemaps');
var rename = require('gulp-rename');

gulp.task('copy', function () {
	return gulp
		.src('scss/modules/_vars.scss')
		.pipe(gulp.dest('pattern-lib/src/assets/ext/scss/modules'));
});

gulp.task('sass:dev', function () {
	return sass('./scss/**/*.scss', {style: 'expanded', sourcemap: true})
		.on('error', sass.logError)
		.pipe(sourcemaps.write('maps', {
			includeContent: false,
			sourceRoot: '/scss'
		}))
		.pipe(gulp.dest('css'))
		.pipe(gulp.dest('pattern-lib/src/assets/ext/css'));
});

gulp.task('sass:dist', function () {
	return sass('scss/**/*.scss', {style: 'compressed', sourcemap: true})
		.on('error', sass.logError)
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(sourcemaps.write('maps', {
			includeContent: false,
			sourceRoot: '/scss'
		}))
		.pipe(gulp.dest('css'))
		.pipe(gulp.dest('pattern-lib/src/assets/ext/css'));
});

gulp.task('default', ['copy', 'sass:dist']);

gulp.task('watch', ['copy', 'sass:dev', 'sass:watch']);

gulp.task('sass:watch', function () {
	gulp.watch('./scss/**/*.scss', ['sass:dev']);
});
