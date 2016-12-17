var gulp = require('gulp');
var coffee = require('gulp-coffee');
var vulcanize = require('gulp-vulcanize');
var polyclean = require('polyclean');


gulp.task('default', ['vulcanize'], function () {
    gulp.src('callback-form.html')
        .pipe(polyclean.cleanCss())
        .pipe(polyclean.leftAlignJs())
        .pipe(polyclean.uglifyJs())
        .pipe(gulp.dest('./'));

    return gulp.src('callback-form.html')
        .pipe(gulp.dest('bower_components/callback-form-test'));
});

gulp.task('vulcanize', ['js-modules'], function () {
    return gulp.src('src/*.html')
        .pipe(vulcanize({
            inlineScripts: true,
            inlineCss: true,
            excludes: ['bower_components/', 'iron-form/']
        }))
        .pipe(gulp.dest('./'))
});

gulp.task('js-modules', function () {
    return gulp.src('src/*.coffee')
        .pipe(coffee())
        .pipe(gulp.dest('dist'));
});