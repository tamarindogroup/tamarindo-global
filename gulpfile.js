const gulp = require('gulp');
const concat = require('gulp-concat');
const order = require("gulp-order");
const browserSync = require('browser-sync').create();


function css() {
    return gulp.src('css/*.css')
            .pipe(order([
            "reset.css",
            "colors.css",
            "typography.css",
            "links.css",
            "icons.css",
            "dev.css",
            "editor.css",
            "utilities.css",
            "components.css"
            ]))
            .pipe(concat('style.css'))
            .pipe(gulp.dest('dist/css'))
            /* stream changes to all browsers */
            .pipe(browserSync.stream()); 
}

function watch() {
    browserSync.init({
        server: {
            baseDir: './'
        }
    });
    /* when css files change, run css compiler */
    gulp.watch('css/*.css', css);
    /* when compiled css file changes, reload */
    gulp.watch('dist/*.css').on('change', browserSync.reload);
}

exports.css = css;
exports.watch = watch;