const gulp = require("gulp")
const pug = require('gulp-pug')
const less = require('gulp-less')
const browserify = require('browserify')
const tsify = require('tsify')
const source = require('vinyl-source-stream')
const buffer = require('vinyl-buffer')
const browserSync = require('browser-sync').create();
const ts = require("gulp-typescript")
const tsProject = ts.createProject("tsconfig.json")

const sources = {
    pug: 'src/*.pug',
    less: 'src/less/*.less',
    ts: 'src/*.ts',
    tsComps: 'src/components/*ts'
}

// gulp.task("typescript", function() {
//     return tsProject.src()
//         .pipe(tsProject())
//         .js.pipe(gulp.dest("dist"));
// });

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
        },
        open: false
    });

    done();
});

gulp.task('browserify', function() {
    return browserify()
        .add('./src/main.ts')
        .plugin(tsify)
        .bundle()
        .pipe(source('bundle.js'))
        .on('error', err => console.log(err))
        .pipe(gulp.dest('./dist/'))
})

gulp.task('watch', function() {
    console.log("watching")
    gulp.watch([sources.pug, sources.less, sources.ts, sources.tsComps]).on('change', gulp.series('browserify', 'less', 'pug', browserSync.reload))
});



gulp.task('default', gulp.series( 'browserify', 'less', 'pug', 'sync', 'watch'));