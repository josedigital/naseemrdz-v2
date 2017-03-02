var gulp        = require('gulp');
var ghPages     = require('gulp-gh-pages');
var browserSync = require('browser-sync').create();
var gutil       = require('gulp-util');
var cssnano     = require('gulp-cssnano');
var sourcemaps  = require('gulp-sourcemaps');
var plumber     = require('gulp-plumber');
var uglify      = require('gulp-uglify');
var concat      = require('gulp-concat');
var gulpif      = require('gulp-if');
var imagemin    = require('gulp-imagemin');
// var karma       = require('gulp-karma');
var cache       = require('gulp-cache');
var rsync       = require('rsyncwrapper').rsync;
var pug         = require('gulp-pug');
var postcss     = require('gulp-postcss');
var cssnext     = require('postcss-cssnext');
var atImport    = require("postcss-import");
// var simpleVars  = require('postcss-simple-vars');
var stylus      = require('gulp-stylus');
var poststylus  = require('poststylus');
var rucksack    = require('rucksack-css');
var rupture     = require('rupture');
var responsiveType = require('postcss-responsive-type');
var autoprefixer = require('autoprefixer');

// var input = './src/css/*.css';
// var output = './dist/css';

// pug templates
gulp.task('pug', function () {
  return gulp.src('src/views/**/[^_]*.pug')
    .pipe(plumber())
    .pipe(pug())
    .pipe(gulp.dest('dist/'));
});
gulp.task('copy', function() {
  return gulp.src(['src/*.html', 'src/*.txt'])
    .pipe(gulp.dest('dist/'))
});


// Uglify and Concat JS
gulp.task('js', function () {
  return gulp.src('src/js/**/*.js')
    .pipe(plumber())
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'));
});

// Imagemin
gulp.task('imagemin', function () {
  return gulp.src('src/img/**/*')
    .pipe(plumber())
    .pipe(cache(imagemin({optimizationLevel: 3, progressive: true, interlaced: true})))
    .pipe(gulp.dest('dist/img'));
});

// browserSync server
gulp.task('serve', function() {
    browserSync.init({
        server: "./dest"
    });
    gulp.watch(input, ['stylus', 'img', 'js']);
    gulp.watch('./dist/**').on('change', browserSync.reload);
});
gulp.task('browser-sync', function () {
  var files = [
    'dist/**/*.html',
    'dist/css/**/*.css',
    'dist/img/**/*',
    'dist/js/**/*.js'
  ];

  browserSync.init(files, {
    server: {
      baseDir: './dist/',
    },
  });
});


gulp.task('stylus', function () {
  gulp.src('./src/css/**/[^_]*.styl')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(stylus({
      use: [
        poststylus(['rucksack-css', 'postcss-cssnext']),
        rupture()
      ]
    }))
    .pipe(concat('style.css'))
    .pipe(cssnano())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./dist/css'))
});


// Call Watch
gulp.task('watch', function () {
  gulp.watch('./src/**/*.pug', ['pug']);
  gulp.watch('./src/css/**/*.styl', ['stylus']);
  gulp.watch('./src/js/**/*.js', ['js']);
  gulp.watch('./src/img/**/*.{jpg,png,gif}', ['imagemin']);
});

// Deploy to gh pages for testing
gulp.task('deploy', function() {
  return gulp.src('./dist/**/*')
    .pipe(ghPages());
});

// Build task
gulp.task('build', ['js', 'pug', 'copy', 'stylus', 'imagemin']);

// Default task
gulp.task('default', ['js', 'pug', 'copy', 'stylus', 'imagemin', 'watch', 'browser-sync']);
