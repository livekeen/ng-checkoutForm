// ---------------------------------
// :: Load Gulp & plugins we'll use
// ---------------------------------

var
  gulp          = require('gulp'),
  autoprefixer  = require('gulp-autoprefixer'),
  browserSync   = require('browser-sync'),
  cache         = require('gulp-cache'),
  concat        = require('gulp-concat'),
  del           = require('del'),
  imagemin      = require('gulp-imagemin'),
  jade          = require('gulp-jade'),
  jshint        = require('gulp-jshint'),
  minifycss     = require('gulp-minify-css'),
  notify        = require('gulp-notify'),
  reload        = browserSync.reload,
  rename        = require('gulp-rename'),
  runSequence   = require('run-sequence'),
  sass          = require('gulp-ruby-sass'),
  stylus        = require('gulp-stylus'),
  // sass          = require('gulp-sass'),
  // slim          = require('gulp-slim'),
  uglify        = require('gulp-uglify');

// ---------------------------------
// :: Variables
// ---------------------------------

var BASEPATHS = {
  app:          './app/',
  dist:         './_dist/',
};

var PATHS = {
  pages:        'views/pages/**/*',
  styles:       'assets/styles/**/*',
  scripts:      'assets/scripts/**/*',
  images:       'assets/images/**/*',
  fonts:        'assets/fonts/**/*',
  extras:       ['assets/fonts/**/*', 'assets/favicons/**/*', 'assets/checkout/**/*'],
};

var TASKS = {
  pages:        'pages',
  styles:       'styles',
  scripts:      'scripts',
  images:       'images',
  fonts:        'fonts',
};

var AUTOPREFIXER_BROWSERS = [
  'ie >= 10',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10'
];

// REMOVE LATER:
// IDEAS FOR IMPROVING GULPFILE:
// https://github.com/google/web-starter-kit
// http://www.justinmccandless.com/blog/A+Tutorial+for+Getting+Started+with+Gulp
// http://markgoodyear.com/2014/01/getting-started-with-gulp

// ---------------------------------
// :: Tasks
// ---------------------------------

// Clean dist directory
gulp.task('clean', del.bind(null, [BASEPATHS.dist], {dot: true}));

// Pages
gulp.task(TASKS.pages, function() {
  return gulp.src(BASEPATHS.app + PATHS.pages)
    .pipe(jade({pretty: true}))
    .pipe(gulp.dest(BASEPATHS.dist)); // exports .html
});

// Styles
gulp.task(TASKS.styles, function() {
  return gulp.src(BASEPATHS.app + PATHS.styles)
    .pipe(sass({ style: 'expanded' }))
    .pipe(autoprefixer({browsers: AUTOPREFIXER_BROWSERS}))
    .pipe(gulp.dest(BASEPATHS.dist)) // exports *.css
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest(BASEPATHS.dist)) // exports *.min.css
    .pipe(reload({stream: true}));
});

// Scripts
gulp.task(TASKS.scripts, function() {
  return gulp.src(BASEPATHS.app + PATHS.scripts)
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(gulp.dest(BASEPATHS.dist)) // exports all javascript files
    .pipe(concat('functions.js'))
    .pipe(gulp.dest(BASEPATHS.dist)) // exports functions.js
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest(BASEPATHS.dist)); // exports functions.min.js
});

// Images
gulp.task(TASKS.images, function() {
  return gulp.src(BASEPATHS.app + PATHS.images)
    .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
    .pipe(gulp.dest(BASEPATHS.dist));
});

// Fonts
gulp.task(TASKS.fonts, function () {
  return gulp.src([BASEPATHS.app + PATHS.fonts])
    .pipe(gulp.dest(BASEPATHS.dist));
});

// Copy all files at the root level (app)
gulp.task('copy', function () {
  return gulp.src([
    'app/**/*',
    '!app/assets/**/*',
    '!app/views/**/*',
    'node_modules/apache-server-configs/dist/.htaccess'
  ], {
    dot: true
  }).pipe(gulp.dest(BASEPATHS.dist));
});

// Watch files for changes & reload
gulp.task('serve', [TASKS.styles], function () {
  browserSync({
    notify: false,
    // Customize the BrowserSync console logging prefix
    logPrefix: 'VNLA',
    // Run as an https
    // Note: this uses an unsigned certificate which on first access
    //       will present a certificate warning in the browser.
    https: true,
    server: BASEPATHS.dist
  });

  gulp.watch([BASEPATHS.app + PATHS.pages], [TASKS.pages, reload]);
  gulp.watch([BASEPATHS.app + PATHS.styles], [TASKS.styles, reload]);
  gulp.watch([BASEPATHS.app + PATHS.scripts], [TASKS.scripts, reload]);
  gulp.watch([BASEPATHS.app + PATHS.images], reload);
});

// Default task
gulp.task('default', ['clean'], function (cb) {
  runSequence(TASKS.styles, [TASKS.scripts, TASKS.pages, TASKS.images, TASKS.fonts, 'copy'], cb);
});