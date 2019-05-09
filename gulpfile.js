const gulp = require("gulp")
const pug = require('gulp-pug')
const less = require('gulp-less')
const browserSync = require('browser-sync').create();
const ts = require("gulp-typescript")
const tsProject = ts.createProject("tsconfig.json")

const sources = {
    pug: 'src/*.pug',
    less: 'src/less/*.less',
    ts: 'src/main.ts'
}

gulp.task("typescript", function() {
    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest("dist"));
});

gulp.task('less', function() {
    return gulp.src(sources.less)
        .pipe(less())
        .pipe(gulp.dest('dist/css/'));
});

gulp.task('pug', function() {
    return gulp.src(sources.pug)
    .pipe(pug())
    .pipe(gulp.dest('dist/'));
})

gulp.task('sync', function(done) {
    browserSync.init({
        server: {
            baseDir: "./dist/"
        }
    });

    done();
});

gulp.task('watch', function() {
    console.log("watching")
    gulp.watch([sources.pug, sources.less, sources.ts]).on('change', gulp.series('typescript', 'less', 'pug', browserSync.reload))
});

gulp.task('default', gulp.series('typescript', 'less', 'pug', 'sync', 'watch'));