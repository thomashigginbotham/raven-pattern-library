/* jshint esversion:6 */
'use strict';

const runSequence = require('run-sequence');
const gulp = require('gulp');
const connect = require('gulp-connect');
const modRewrite = require('connect-modrewrite');
const open = require('gulp-open');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const processhtml = require('gulp-processhtml');

const config = {
	port: 9090
};

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
	gulp.watch('./html/**/*.html', () => {
		runSequence('html:compile:dev', 'html:copy:dev', 'livereload');
	});
});

gulp.task('sass:watch', () => {
	gulp.watch('./scss/**/*.scss', () => {
		runSequence(['sass:dev', 'sass:copy'], 'livereload')
	});
});

gulp.task('serve', ['open:dev', 'watch']);

// Helper functions
function compileHtml (opts) {
	const dest = (opts.environment === 'dist') ? 'dist' : '.tmp';

	return gulp.src('html/**/*.html')
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
		.pipe(gulp.dest('pattern-lib/src/assets/ext/html'))
		.pipe(gulp.dest('pattern-lib/dist/assets/ext/html'));
});

gulp.task('html:copy:dist', () => {
	return gulp
		.src('dist/**/*.html')
		.pipe(gulp.dest('pattern-lib/dist/assets/ext/html'));
});

gulp.task('sass:dev', () => {
	return gulp.src('scss/**/*.scss')
		.pipe(sourcemaps.init())
		.pipe(sass({ outputStyle: 'expanded' })
			.on('error', sass.logError))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('.tmp/css'))
		.pipe(gulp.dest('pattern-lib/src/assets/ext/css'))
		.pipe(gulp.dest('pattern-lib/dist/assets/ext/css'));
});

gulp.task('sass:dist', () => {
	return gulp.src('scss/**/*.scss')
		.pipe(sourcemaps.init())
		.pipe(sass({ outputStyle: 'compressed' })
			.on('error', sass.logError))
		.pipe(sourcemaps.write('maps', {
			includeContent: false,
			sourceRoot: '/scss'
		}))
		.pipe(gulp.dest('pattern-lib/dist/assets/ext/css'))
		.pipe(rename({ suffix: '.min' }))
		.pipe(gulp.dest('dist/css'));
});

gulp.task('sass:copy', () => {
	return gulp
		.src('scss/modules/_vars.scss')
		.pipe(gulp.dest('pattern-lib/src/assets/ext/scss/modules'))
		.pipe(gulp.dest('pattern-lib/dist/assets/ext/scss/modules'));
});

gulp.task('connect:dev', () => {
	connect.server({
		root: ['.tmp', 'pattern-lib'],
		port: config.port,
		middleware: () => {
			return [
				modRewrite([
					'^/pattern-lib(.*\\..{2,4})$ /dist$1 [L]',
					'^/pattern-lib(.*)$ /dist/index.html [L]',
					'^/assets(.*)$ /dist/assets$1 [L]'
				])
			];
		},
		livereload: true
	});
});

gulp.task('open:dev', ['connect:dev'], () => {
	gulp.src(__filename)
		.pipe(open({ uri: 'http://localhost:' + config.port + '/pattern-lib' }));
});

gulp.task('livereload', () => {
	const sources = ['.tmp/**/*.{html,css,js}'];

	gulp.src(sources)
		.pipe(connect.reload());
});
