const gulp = require('gulp');
const concat = require('gulp-concat');
const order = require('gulp-order');
const browserSync = require('browser-sync').create();

function css() {
    return (
        gulp
            .src('css/*.css')
            .pipe(
                order([
                    'reset.css',
                    'colors.css',
                    'spacing.css',
                    'typography.css',
                    'grid.css',
                    'buttons.css',
                    'layout.css',
                    'forms.css',
                    'icons.css',
                    'dev.css',
                    'editor.css',
                    'utilities.css',
                    'components.css',
                    'styleguide.css',
                    'overrides.css',
                    'memberstack.css',
                ])
            )
            .pipe(concat('style.css'))
            .pipe(gulp.dest('dist/css'))
            /* stream changes to all browsers */
            .pipe(browserSync.stream())
    );
}

function watch() {
    browserSync.init({
        ui: {
            port: 8080,
        },
        server: {
            baseDir: './',
        },
        port: 3000,
        open: false,
    });
    /* when css files change, run css compiler */
    gulp.watch('css/*.css', css);
    /* when compiled css file changes, reload */
    gulp.watch('dist/*.css').on('change', browserSync.reload);

    /* and same for dev */
    gulp.watch('css-dev/*.css', css_dev);
    gulp.watch('dist-dev/*.css').on('change', browserSync.reload);
}

/* extra function to do any dev css */
function css_dev() {
    return (
        gulp
            .src('css-dev/*.css')
            .pipe(order(['item.css']))
            .pipe(concat('style-dev.css'))
            .pipe(gulp.dest('dist-dev/css'))
            /* stream changes to all browsers */
            .pipe(browserSync.stream())
    );
}

exports.css = css;
exports.watch = watch;
exports.css_dev = css_dev;
