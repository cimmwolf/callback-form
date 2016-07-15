var gulp = require('gulp');
var coffee = require('gulp-coffee');
var postcss = require('gulp-postcss');
var stylemod = require('gulp-style-modules');
var vulcanize = require('gulp-vulcanize');
var polyclean = require('polyclean');
var sass = require('gulp-sass');

gulp.task('default', ['components'], function () {
});

gulp.task('components', ['vulcanize'], function () {
    return gulp.src('assets/web-components/*')
        .pipe(polyclean.cleanCss())
        .pipe(polyclean.leftAlignJs())
        .pipe(polyclean.uglifyJs())
        .pipe(gulp.dest('assets/web-components'));
});

gulp.task('vulcanize', ['style-modules', 'js-modules'], function () {
    return gulp.src('src/*.html')
        .pipe(vulcanize({
            inlineScripts: true,
            inlineCss: true,
            excludes: ['bower_components/']
        }))
        .pipe(gulp.dest('./'))
});

gulp.task('style-modules', function () {
    var path = require('path');
    return gulp.src('src/*.sass')
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss([require('postcss-flexibility'), require('autoprefixer')({
            browsers: ['last 3 versions'],
            cascade: false
        })]))
        .pipe(stylemod({
            filename: function (file) {
                return path.basename(file.path, path.extname(file.path));
            },
            moduleId: function (file) {
                return path.basename(file.path, path.extname(file.path));
            }
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('js-modules', function () {
    return gulp.src('src/*.coffee')
        .pipe(coffee())
        .pipe(gulp.dest('dist'));
});