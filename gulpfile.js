var gulp = require('gulp');
var polyclean = require('polyclean');

gulp.task('default', ['develop'], function () {
    return gulp.src('callback-form.html')
        .pipe(polyclean.cleanCss())
        .pipe(polyclean.leftAlignJs())
        .pipe(polyclean.uglifyJs())
        .pipe(gulp.dest('./'));
});

gulp.task('develop', function () {
    return gulp.src('src/callback-form.html')
        .pipe(gulp.dest('./'))
        .pipe(gulp.dest('bower_components/callback-form-test'));
});