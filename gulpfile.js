const gulp        = require('gulp');
const fileinclude = require('gulp-file-include');
const server = require('browser-sync').create();
const { watch, series } = require('gulp');
const sass = require('gulp-sass');
sass.compiler = require('node-sass');
var concat = require('gulp-concat');
var rename = require('gulp-rename');

const paths = {
  assets: {
    src: './src/',
    dest: './build/assets/'
  },
  scripts: {
    src: './src/',
    dest: './build/'
  },
  scss: {
    src: ['./src/assets/scss/*.scss', './src/assets/scss/**/*.scss'],
    exclude: '!./src/assets/scss/**/*.scss'
  },
  js: {
    dest_dir: './assets/js'
  },
  css: {
    dest_dir: './assets/css'
  },
  i18n: {
    src: './src/assets/i18n/*.json',
    dest_dir: './assets/i18n'
  },
};

// Reload Server
async function reload() {
  server.reload();
}

// Sass compiler
async function compileScss() {
  gulp.src(paths.scss.src)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(paths.css.dest_dir));
}

// JS vendor compiler
async function compileVendorJS() {
  gulp.src('./src/assets/js/vendor.js')
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest(paths.js.dest_dir));
}
async function compileJS() {
  gulp.src('./src/assets/js/index.js')
    .pipe(concat('bundle.js'))
    .pipe(gulp.dest(paths.js.dest_dir));
}

async function compileI18n() {
  gulp.src([paths.i18n.src])
    .pipe(gulp.dest(paths.i18n.dest_dir));

  // gulp.src([paths.i18n.src])
  //   .pipe(rename('zh.json'))
  //   .pipe(gulp.dest(paths.i18n.dest_dir));
}

// Copy assets after build
async function copyAssets() {
  gulp.src(['assets/**/*'])
    .pipe(gulp.dest(paths.assets.dest));
}

// Build files html and reload server
async function buildAndReload() {
  await includeHTML();
  await copyAssets();
  reload();
}

// Build files html and reload server
async function srcReload() {
  await compileJS();
  await compileScss();
  await compileVendorJS();
  await buildAndReload();
  reload();
}

async function includeHTML(){
  return gulp.src([
    './src/pages/*.html',
    './src/pages/**/*.html',
    '!./src/components/**/*.html', // ignore
    ])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest(paths.scripts.dest));
}
exports.includeHTML = includeHTML;


gulp.task('build', async function() { 
  buildAndReload();
});

exports.default = async function() {
  // Init serve files from the build folder
  server.init({
    server: {
      baseDir: paths.scripts.dest
    }
  });
  // Build and reload at the first time
  buildAndReload();

  // Watch Sass task
  // watch('./src/assets/scss/*.scss',  series(compileScss));
  // watch('./src/assets/scss/**/*.scss',  series(compileScss));
  // watch i18n
  // watch([paths.i18n.src],  series(compileI18n));
  // Watch js task
  // watch('./src/assets/js/vendor.js',  series(compileVendorJS));
  // watch(['./src/assets/js/*.js'],  series(compileJS));

  // Watch task
  watch([
    "src/**/*"
  ], series(srcReload));
  
  watch([
    // "./src/pages/**/*",
    "assets/**/*"
  ], series(buildAndReload));
};