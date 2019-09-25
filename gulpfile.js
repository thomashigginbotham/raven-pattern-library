/* jshint esversion:6 */
'use strict';

const argv = require('yargs').argv;
const connect = require('gulp-connect');
const cssom = require('cssom');
const del = require('del');
const gulp = require('gulp');
const merge = require('merge-stream');
const modRewrite = require('connect-modrewrite');
const open = require('gulp-open');
const processhtml = require('gulp-processhtml');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const transform = require('gulp-transform');
const compiler = require('webpack');
const webpack = require('webpack-stream');

const env = { };
const config = {
  port: 9090,
  rplUri: 'pattern-lib',
  srcPaths: {
    dir: 'src',
    htmlDir: 'src/html',
    sassDir: 'src/styles',
    jsDir: 'src/scripts',
    imagesDir: 'src/images',
    fontsDir: 'src/fonts'
  },
  tempPaths: {
    outputDir: '.tmp',
    htmlDir: '.tmp/html',
    cssDir: '.tmp/styles',
    jsDir: '.tmp/scripts',
    rplCustomPages: '.tmp/rpl-assets/rpl-pages'
  },
  distPaths: {
    outputDir: 'dist',
    htmlDir: 'dist/html',
    cssDir: 'dist/styles',
    jsDir: 'dist/scripts',
    imagesDir: 'dist/images',
    fontsDir: 'dist/fonts',
    rplCustomPages: 'dist/rpl-assets/rpl-pages'
  },
  rplPaths: {
    src: 'rpl-src',
    assets: 'rpl-assets',
    customPages: 'rpl-assets/rpl-pages'
  }
};

/* ------------------------------------
 * Helper Functions
 * ------------------------------------ */

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

  // Add rules to override some styles on html and body elements
  sheet.cssRules.push({
    selectorText: 'html,body',
    cssText: 'html,body{margin:0;padding:0;width:auto;height:auto}',
    style: {
      0: 'margin',
      1: 'padding',
      2: 'width',
      3: 'height',
      length: 4,
      margin: '0',
      padding: '0',
      width: 'auto',
      height: 'auto'
    }
  });

  const ruleList = sheet.cssRules;

  let prefixedRules = Array.from(ruleList).reduce((output, rule) => {
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

      if (!rule.cssRules) {
        // No rules present. Return as is.
        return output + cssText;
      }

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

  return prefixedRules;
}

/* ------------------------------------
 * Basic Tasks
 * ------------------------------------ */

 /**
  * Uses development environment paths if paths are unset.
  */
gulp.task('environment', (done) => {
  if (!env.hasOwnProperty('paths')) {
    env.paths = config.tempPaths;
  }

  done();
});

/**
 * Deletes all files in output directories.
 */
gulp.task('clean', gulp.series('environment', () => {
  return del(`${env.paths.outputDir}/*`);
}));

/**
 * Compiles HTML files.
 */
gulp.task('html', gulp.series('environment', () => {
  return gulp.src(`${config.srcPaths.htmlDir}/**/*.html`)
    .pipe(processhtml({
      environment: (env.paths.htmlDir === config.tempPaths.htmlDir) ?
        'dev' :
        'dist',
      recursive: true
    }))
    .pipe(gulp.dest(env.paths.htmlDir));
}));

/**
 * Copies files into dist HTML directory.
 */
gulp.task('html:copy', () => {
  const copyHtml = gulp.src([
    `${config.distPaths.htmlDir}/**/*`,
    `!${config.distPaths.htmlDir}/components`,
    `!${config.distPaths.htmlDir}/components/**/*`
  ])
    .pipe(gulp.dest(config.distPaths.outputDir));

  const copyDepends = gulp.src([
    `${config.srcPaths.htmlDir}/**/*`,
    `!${config.srcPaths.htmlDir}/**/*.htm*`
  ])
    .pipe(gulp.dest(config.distPaths.htmlDir));

  return merge(copyHtml, copyDepends);
});

/**
 * Deletes HTML files from the dist output directory.
 */
gulp.task('html:delete', () => {
  return del([
    `${config.distPaths.htmlDir}/**/*`,
    `!${config.distPaths.htmlDir}/components`,
    `!${config.distPaths.htmlDir}/components/**/*`
  ]);
});

/**
 * Copies pattern library files into dist output directory.
 */
gulp.task('rpl:copy', () => {
  const copyRplSrc = gulp.src(`${config.rplPaths.src}/dist/**/*`)
    .pipe(gulp.dest(`${config.distPaths.outputDir}/${config.rplUri}`));

  const copyRplAssets = gulp.src([
    `${config.rplPaths.assets}/**/*`,
    `!${config.rplPaths.customPages}/**`
  ]).pipe(gulp.dest(`${config.distPaths.outputDir}/${config.rplPaths.assets}`));

  const buildThenCopyRplPages = gulp.src([`${config.rplPaths.customPages}/**/*`])
    .pipe(processhtml({
      environment: (env.paths.htmlDir === config.tempPaths.htmlDir) ?
        'dev' :
        'dist',
      recursive: true
    }))
    .pipe(gulp.dest(env.paths.rplCustomPages));

  return merge(copyRplSrc, copyRplAssets, buildThenCopyRplPages);
});

/**
 * Transpiles Sass into expanded CSS with source maps.
 */
gulp.task('sass:expanded', gulp.series('environment', () => {
  return gulp.src(`${config.srcPaths.sassDir}/**/*.scss`)
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: 'expanded' })
      .on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(env.paths.cssDir));
}));

/**
 * Transpiles Sass into minified CSS with source maps.
 */
gulp.task('sass:compressed', gulp.series('environment', () => {
  return gulp.src(`${config.srcPaths.sassDir}/**/*.scss`)
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: 'compressed' })
      .on('error', sass.logError))
    .pipe(sourcemaps.write('maps', {
      includeContent: false,
      sourceRoot: config.srcPaths.sassDir
    }))
    .pipe(gulp.dest(env.paths.cssDir));
}));

/**
 * Copies Sass variables file to dist output directory.
 */
gulp.task('vars:copy', () => {
  return gulp.src(`${config.srcPaths.sassDir}/modules/**/_vars.scss`)
    .pipe(gulp.dest(`${config.distPaths.cssDir}/modules`));
});

/**
 * Adds a prefix to all CSS selectors to prevent outside styles from leaking in.
 */
gulp.task('scopeStyles', gulp.series('environment', () => {
  return gulp
    .src(`${env.paths.cssDir}/*.css`)
    .pipe(transform('utf8', content => prefixCssRules(
      content,
      ['.main-content .rpl-user-styles']
    )))
    .pipe(rename('rpl-scoped-styles.css'))
    .pipe(gulp.dest(env.paths.cssDir));
}));

/**
 * Uses Webpack to build JavaScript.
 */
gulp.task('scripts:build', gulp.series('environment', () => {
  const webpackConfig = require('./webpack.config.js');

  webpackConfig.mode = (env.paths.jsDir === config.tempPaths.jsDir) ?
    'development' :
    'production';

  return gulp
    .src(`${config.srcPaths.jsDir}/**/*.js`)
    .pipe(webpack(webpackConfig, compiler, (err, stats) => { }))
    .pipe(gulp.dest(env.paths.jsDir));
}));

/**
 * Copies scripts to output directories.
 */
gulp.task('scripts', gulp.series('environment', () => {
  return gulp
    .src(`${config.srcPaths.jsDir}/**/*.js`)
    .pipe(gulp.dest(env.paths.jsDir));
}));

/**
 * Copies font files to output directories.
 */
gulp.task('fonts', gulp.series('environment', () => {
  return gulp
    .src(`${config.srcPaths.fontsDir}/**/*`)
    .pipe(gulp.dest(env.paths.fontsDir));
}));

/**
 * Copies image files to output directories.
 */
gulp.task('images', gulp.series('environment', () => {
  return gulp
    .src(`${config.srcPaths.imagesDir}/**/*`)
    .pipe(gulp.dest(env.paths.imagesDir));
}));

/**
 * Starts a development web server.
 */
gulp.task('connect', done => {
  connect.server({
    root: [
      config.tempPaths.outputDir,
      config.srcPaths.dir,
      config.rplPaths.src,
      './'
    ],
    port: config.port,
    middleware: () => {
      return [
        modRewrite([
          `^/$ /html/ [L]`,
          `^/([^/]+\\.html?$) /html/$1 [L]`,
          `^/${config.rplUri}/(.+\\..{2,4})$ /dist/$1 [L]`,
          `^/${config.rplUri}(.*)$ /dist/index.html [L]`
        ])
      ];
    },
    livereload: true
  });

  done();
});

/**
 * Opens the pattern library in a browser.
 */
gulp.task('open', gulp.parallel('connect', () => {
  return gulp.src(__filename)
    .pipe(open({
      uri: `http://localhost:${config.port}/${config.rplUri}`
    }));
}));

/**
 * Reloads pages when files change.
 */
gulp.task('livereload', () => {
  const sources = [
    `${config.tempPaths.outputDir}/**/*.{htm,html,css,js}`,
    `${config.srcPaths.dir}/**/*.{js}`
  ];

  return gulp.src(sources)
    .pipe(connect.reload());
});

/**
 * Watches HTML files for changes, then compiles them and refreshes pages.
 */
gulp.task('watch:html', done => {
  gulp.watch(
    `${config.srcPaths.htmlDir}/**/*.html`,
    gulp.series(
      (done) => { del(`${config.tempPaths.htmlDir}/*`).then(() => done()); },
      'html',
      'livereload'
    )
  );

  done();
});

/**
 * Watches Sass files for changes, then transpiles to CSS and refreshes pages.
 */
gulp.task('watch:sass', done => {
  gulp.watch(
    `${config.srcPaths.sassDir}/**/*.scss`,
    gulp.series(
      (done) => { del(`${config.tempPaths.cssDir}/*`); done(); },
      'sass:expanded',
      'scopeStyles',
      'livereload'
    )
  );

  done();
});

/**
 * Watches JS files for changes, then bundles them with Webpack.
 */
gulp.task('watch:js', done => {
  gulp.watch(
    `${config.srcPaths.jsDir}/**/*`,
    gulp.series(
      'scripts:build',
      'livereload'
    )
  );

  done();
});

/**
 * Refreshes pages when static file assets change.
 */
gulp.task('watch:files', done => {
  gulp.watch(
    [
      `${config.srcPaths.imagesDir}/**/*`,
      `${config.srcPaths.fontsDir}/**/*`,
      `${config.rplPaths.assets}/**/*`
    ],
    gulp.series('livereload')
  );

  done();
});

/**
 * Cleans up temp files, then compiles and watches relevant files for changes.
 */
gulp.task('watch', gulp.series(
  'clean',
  gulp.parallel(
    'html',
    'sass:expanded',
    'scripts:build'
  ),
  'scopeStyles',
  gulp.parallel(
    'watch:html',
    'watch:sass',
    'watch:js',
    'watch:files'
  )
));


/* ------------------------------------
 * Primary tasks
 * ------------------------------------ */

/**
 * Starts a development server and watches for file changes.
 */
gulp.task('serve', done => {
  if (argv.o) {
    gulp.series('watch', 'open')();
  } else {
    gulp.series('watch', 'connect')();
  }

  done();
});


/**
 * Compiles files for production.
 */
gulp.task('default', gulp.series(
    (done) => { env.paths = config.distPaths; done(); },
    'clean',
    gulp.parallel(
      'html',
      'sass:compressed',
      'scripts:build',
      'images',
      'fonts',
      'vars:copy'
    ),
    'scopeStyles',
    gulp.parallel(
      'html:copy',
      'rpl:copy'
    ),
    'html:delete'
  )
);
