/* jshint esversion:6 */
'use strict';

const runSequence = require('run-sequence');
const gulp = require('gulp');
const sass = require('gulp-ruby-sass');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const processhtml = require('gulp-processhtml');

// Helper functions
function compileHtml (opts) {
	const dest = (opts.environment === 'dist') ? 'dist' : '.tmp';

	return gulp.src('html/*.html')
		.pipe(processhtml(opts))
		.pipe(gulp.dest(dest));
}

// Helper tasks
gulp.task('html:compile:dev', () => {
	const opts = {
		environment: 'dev',
		recursive: true
	};

	return compileHtml(opts);
});

gulp.task('html:compile:dist', () => {
	const opts = {
		environment: 'dist',
		recursive: true
	};

	return compileHtml(opts);
});

gulp.task('html:copy:dev', () => {
	return gulp
		.src('.tmp/**/*.html')
		.pipe(gulp.dest('pattern-lib/src/assets/ext/html'));
});

gulp.task('html:copy:dist', () => {
	return gulp
		.src('dist/**/*.html')
		.pipe(gulp.dest('pattern-lib/src/assets/ext/html'));
});

gulp.task('sass:dev', () => {
	return sass('./scss/**/*.scss', {style: 'expanded', sourcemap: true})
		.on('error', sass.logError)
		.pipe(sourcemaps.write('maps', {
			includeContent: false,
			sourceRoot: '/scss'
		}))
		.pipe(gulp.dest('css'))
		.pipe(gulp.dest('pattern-lib/src/assets/ext/css'));
});

gulp.task('sass:dist', () => {
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

gulp.task('sass:copy', () => {
	return gulp
		.src('scss/modules/_vars.scss')
		.pipe(gulp.dest('pattern-lib/src/assets/ext/scss/modules'));
});

// Primary tasks
gulp.task('default', (callback) => {
	runSequence(
		['html:compile:dist', 'sass:copy', 'sass:dist'],
		'html:copy:dist',
		callback
	);
});

gulp.task('watch', (callback) => {
	runSequence(
		['html:compile:dev', 'sass:copy', 'sass:dev'],
		'html:copy:dev',
		'html:watch',
		'sass:watch',
		callback
	);
});

gulp.task('html:watch', () => {
	gulp.watch('./html/**/*.html', (callback) => {
		runSequence('html:compile:dev', 'html:copy:dev', callback);
	});
});

gulp.task('sass:watch', () => {
	gulp.watch('./scss/**/*.scss', ['sass:dev', 'sass:copy']);
});
