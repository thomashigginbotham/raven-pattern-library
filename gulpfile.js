/* jshint esversion:6 */
'use strict';

const argv = require('yargs').argv;
const del = require('del');
const cssom = require('cssom');
const gulp = require('gulp');
const concat = require('gulp-concat');
const connect = require('gulp-connect');
const modRewrite = require('connect-modrewrite');
const open = require('gulp-open');
const processhtml = require('gulp-processhtml');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const transform = require('gulp-transform');

const config = {
	port: 9090
};

/* ------------------------------------
 * Helper Functions
 * ------------------------------------ */

/**
 * Runs processhtml task and saves resulting file.
 * @param opts Options to be passed to processhtml.
 */
function compileHtml (opts) {
	const dest = (opts.environment === 'dist') ? 'dist' : '.tmp';
	const filePattern = (dest === 'dist') ? 'html/*.html' : 'html/**/*.html';

	return gulp.src(filePattern)
		.pipe(processhtml(opts))
		.pipe(gulp.dest(dest));
}

/**
 * Adds a selector prefix to each rule in a string of CSS rules.
 * @param styles A string of styles to prefix.
 * @param prefixes An array of CSS selectors to prefix every style rule.
 * @returns A string of modified styles.
 */
function prefixCssRules(styles, prefixes) {
	const sheet = cssom.parse(styles);

	if (!sheet.cssRules) {
		return '';
	}

	const ruleList = sheet.cssRules;

	return Array.from(ruleList).reduce((output, rule) => {
		const styleRule = rule;
		const prefixedSelectorText = (selectorText) => {
			return selectorText.split(',')
				.reduce((prev, selector) => {
					const trimmedPrev = prev.trim();
					const trimmedSelector = selector
						.trim()
						.replace(/^html$|^body$/, '');
					const prefixedSelectors = prefixes.map(prefix => {
						return `${prefix} ${trimmedSelector}`.trim();
					});

					if (!trimmedPrev) {
						return prefixedSelectors.join(',');
					}

					return `${trimmedPrev}, ` + prefixedSelectors.join(',');
				}, '');
		};

		if (styleRule.selectorText) {
			const newSelectorText = prefixedSelectorText(styleRule.selectorText);

			return output + styleRule.cssText.replace(
				styleRule.selectorText,
				newSelectorText
			);
		}

		// Handle @media and @supports
		if (rule.media || rule.conditionText) {
			let cssText = rule.cssText;

			Array.from(rule.cssRules).forEach(rule => {
				const styleRule = rule;
				const newSelectorText = prefixedSelectorText(styleRule.selectorText);
				const newRuleText = styleRule.cssText.replace(
					styleRule.selectorText,
					newSelectorText
				);

				cssText = cssText.replace(styleRule.cssText, newRuleText);
			});

			return output + cssText;
		}

		// Handle @font-face
		if (
			rule.style &&
			rule.constructor &&
			rule.constructor.name === 'CSSFontFaceRule'
		) {
			let cssText = '@font-face{';

			for (let n = 0; n < rule.style.length; n++) {
				const selector = rule.style[n];

				cssText += selector + ':';
				cssText += rule.style[selector] + ';';
			}

			cssText += '}';

			return output + cssText;
		}

		// Unknown CSS. Ignore it.
		return output;
	}, '');
}

/* ------------------------------------
 * Helper tasks
 * ------------------------------------ */

/**
 * Deletes all files in the dist directory.
 */
gulp.task('clean:dist', () => {
	return del('dist/*');
});

/**
 * Deletes all files in the .tmp directory.
 */
gulp.task('clean:temp', () => {
	return del('.tmp/*');
});

/**
 * Deletes CSS in the .tmp directory.
 */
gulp.task('clean:tempCss', () => {
	return del('.tmp/css/*');
});

/**
 * Compiles HTML files for dev environment.
 */
gulp.task('html:compile:dev', () => {
	const opts = {
		environment: 'dev',
		recursive: true
	};

	return compileHtml(opts);
});

/**
 * Compiles HTML files for production environment.
 */
gulp.task('html:compile:dist', () => {
	const opts = {
		environment: 'dist',
		recursive: true
	};

	return compileHtml(opts);
});

/**
 * Copies compiled HTML from dev directory to pattern library assets directory.
 */
gulp.task('html:copy:dev', () => {
	return gulp
		.src('.tmp/**/*.html')
		.pipe(gulp.dest('pattern-lib/src/assets/ext/html'))
		.pipe(gulp.dest('pattern-lib/dist/assets/ext/html'));
});

/**
 * Copies compiled HTML from dist directory to pattern library assets directory.
 */
gulp.task('html:copy:dist', () => {
	return gulp
		.src('dist/**/*.html')
		.pipe(gulp.dest('pattern-lib/dist/assets/ext/html'));
});

/**
 * Transpiles Sass into CSS and saves into dev directory.
 */
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

/**
 * Transpiles Sass into CSS and saves into dist directory.
 */
gulp.task('sass:dist', () => {
	return gulp.src('scss/**/*.scss')
		.pipe(rename({ suffix: '.min' }))
		.pipe(sourcemaps.init())
		.pipe(sass({ outputStyle: 'compressed' })
			.on('error', sass.logError))
		.pipe(sourcemaps.write('maps', {
			includeContent: false,
			sourceRoot: '/scss'
		}))
		.pipe(gulp.dest('pattern-lib/dist/assets/ext/css'))
		.pipe(gulp.dest('dist/css'));
});

/**
 * Copies Sass variables into pattern library assets.
 */
gulp.task('sass:copy', () => {
	return gulp
		.src('scss/modules/_vars.scss')
		.pipe(gulp.dest('pattern-lib/src/assets/ext/scss/modules'))
		.pipe(gulp.dest('pattern-lib/dist/assets/ext/scss/modules'));
});

/**
 * Adds a prefix to all CSS selectors to prevent outside styles from leaking in.
 */
gulp.task('scopeStyles', () => {
	return gulp
		.src('.tmp/css/*.css')
		.pipe(concat('all.css'))
		.pipe(transform('utf8', content => prefixCssRules(
			content,
			[
				'.main-content .rpl-user-styles'
			]
		)))
		.pipe(rename('rpl-scoped-styles.css'))
		.pipe(gulp.dest('pattern-lib/src/assets/ext/css'))
		.pipe(gulp.dest('pattern-lib/dist/assets/ext/css'));
});

/**
 * Copies JS files to dev directories.
 */
gulp.task('js:copy:dev', () => {
	return gulp
		.src('js/**/*.js')
		.pipe(gulp.dest('.tmp/js'))
		.pipe(gulp.dest('pattern-lib/src/assets/ext/js'))
		.pipe(gulp.dest('pattern-lib/dist/assets/ext/js'));
});

/**
 * Copies JS files to production directories.
 */
gulp.task('js:copy:dist', () => {
	return gulp
		.src('js/**/*.js')
		.pipe(gulp.dest('dist/js'))
		.pipe(gulp.dest('pattern-lib/dist/assets/ext/js'));
});

/**
 * Copies pattern library source assets to the compiled assets directory.
 */
gulp.task('rpl:copy:dev', () => {
	return gulp
		.src('pattern-lib/src/assets/*')
		.pipe(gulp.dest('pattern-lib/dist/assets'));
});

/**
 * Copies pattern library files to production directory.
 */
gulp.task('rpl:copy:dist', () => {
	return gulp
		.src('pattern-lib/dist/**/*')
		.pipe(gulp.dest('dist/pattern-lib'));
});

/**
 * Copies font files to dev directory.
 */
gulp.task('fonts:copy:dev', () => {
	return gulp
		.src('fonts/**/*')
		.pipe(gulp.dest('.tmp/fonts'));
});

/**
 * Copies font files to production directory.
 */
gulp.task('fonts:copy:dist', () => {
	return gulp
		.src('fonts/**/*')
		.pipe(gulp.dest('dist/fonts'));
});

/**
 * Copies image files to dev directory.
 */
gulp.task('images:copy:dev', () => {
	return gulp
		.src('images/**/*')
		.pipe(gulp.dest('.tmp/images'));
});

/**
 * Copies image files to production directory.
 */
gulp.task('images:copy:dist', () => {
	return gulp
		.src('images/**/*')
		.pipe(gulp.dest('dist/images'));
});

/**
 * Copies Sass files to production directory.
 */
gulp.task('sass:copy:dist', () => {
	return gulp
		.src('scss/**/*')
		.pipe(gulp.dest('dist/scss'));
});

/**
 * Starts a development web server.
 */
gulp.task('connect:dev', done => {
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

	done();
});

/**
 * Starts a development web server, then opens the pattern library in a browser.
 */
gulp.task('open:dev', gulp.parallel('connect:dev', () => {
	return gulp.src(__filename)
		.pipe(open({ uri: 'http://localhost:' + config.port + '/pattern-lib' }));
}));

/**
 * Reloads open browsers when files change.
 */
gulp.task('livereload', () => {
	const sources = ['.tmp/**/*.{html,css,js}'];

	return gulp.src(sources)
		.pipe(connect.reload());
});

/* ------------------------------------
 * Primary tasks
 * ------------------------------------ */

/**
 * Watches HTML files for changes, then compiles them and refreshes the browser
 * if open.
 */
gulp.task('html:watch', done => {
	gulp.watch(
		'html/**/*.html',
		gulp.series(
			'html:compile:dev',
			'html:copy:dev',
			'livereload'
		)
	);

	done();
});

/**
 * Watches Sass files for changes, then transpiles to CSS and refreshes the
 * browser if open.
 */
gulp.task('sass:watch', done => {
	gulp.watch(
		'scss/**/*.scss',
		gulp.series(
			'clean:tempCss',
			gulp.parallel('sass:dev', 'sass:copy'),
			'scopeStyles',
			'livereload'
		)
	);

	done();
});

/**
 * Copies JavaScript files to .tmp directory when they change, then refreshes
 * the browser if open.
 */
gulp.task('js:watch', done => {
	gulp.watch(
		'js/**/*.js',
		gulp.series('js:copy:dev', 'livereload')
	);

	done();
});

/**
 * Copies fonts to .tmp directory when they change, then refreshes the browser
 * if open.
 */
gulp.task('fonts:watch', done => {
	gulp.watch(
		'fonts/**/*',
		gulp.series('fonts:copy:dev', 'livereload')
	);

	done();
});

/**
 * Copies images to .tmp directory when they change, then refreshes the browser
 * if open.
 */
gulp.task('images:watch', done => {
	gulp.watch(
		'images/**/*',
		gulp.series('images:copy:dev', 'livereload')
	);

	done();
});

/**
 * Copies pattern lib assets to .tmp directory when they change, then refreshes
 * the browser if open.
 */
gulp.task('rpl:watch', done => {
	gulp.watch(
		['pattern-lib/src/assets/*', 'pattern-lib/config/*'],
		gulp.series('rpl:copy:dev', 'livereload')
	);

	done();
});

/**
 * Cleans up temp files, then compiles and watches relevant files for changes.
 */
gulp.task(
	'watch',
	gulp.series(
		'clean:temp',
		gulp.parallel(
			'html:compile:dev',
			'sass:copy',
			'sass:dev',
			'js:copy:dev',
			'rpl:copy:dev'
		),
		gulp.parallel('html:copy:dev', 'scopeStyles'),
		gulp.parallel('fonts:copy:dev', 'images:copy:dev'),
		gulp.parallel(
			'html:watch',
			'sass:watch',
			'js:watch',
			'fonts:watch',
			'images:watch',
			'rpl:watch'
		)
	)
);

/**
 * Starts a development server and watches for file changes.
 */
gulp.task('serve', done => {
	const serverUrl = `http://localhost:${config.port}/pattern-lib`;

	if (argv.o) {
		gulp.series('open:dev', 'watch')();
	} else {
		console.log(`Open ${serverUrl} in your browser.`);
		gulp.series('connect:dev', 'watch')();
	}

	done();
});

/**
 * Cleans up dist environment, then compiles files for production.
 */
gulp.task(
	'default',
	gulp.series(
		'clean:dist',
		gulp.parallel(
			'html:compile:dist',
			'sass:copy',
			'sass:dist',
			'js:copy:dist'
		),
		'html:copy:dist',
		gulp.parallel(
			'rpl:copy:dist',
			'fonts:copy:dist',
			'images:copy:dist',
			'sass:copy:dist'
		)
	)
);
