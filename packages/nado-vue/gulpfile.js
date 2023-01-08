import gulp from 'gulp'
import postcss from 'gulp-postcss'
import rename from 'gulp-rename'
import csso from 'postcss-csso'
import postcssImport from 'postcss-import'
import postcssNested from 'postcss-nested'

export const stylesTokens = () =>
  gulp
    .src('src/styles/tokens/tokens.css')
    .pipe(postcss([postcssImport, postcssNested, csso]))
    .pipe(gulp.dest('dist/tokens'))

export const stylesTheme = () =>
  gulp
    .src('src/styles/theme/theme.css')
    .pipe(postcss([postcssImport, postcssNested, csso]))
    .pipe(gulp.dest('dist/theme'))

export const stylesComponents = () =>
  gulp
    .src(['src/components/**/style/*.css', '!src/styles/components/components.css'])
    .pipe(postcss([postcssImport, postcssNested, csso]))
    .pipe(
      rename({
        dirname: '',
      }),
    )
    .pipe(gulp.dest('dist/css'))

export const stylesAll = () =>
  gulp
    .src(['src/styles/styles.css'])
    .pipe(postcss([postcssImport, postcssNested, csso]))
    .pipe(gulp.dest('dist'))

export const stylesFonts = () =>
  gulp
    .src('src/styles/fonts/fonts.css')
    .pipe(postcss([postcssImport, postcssNested, csso]))
    .pipe(gulp.dest('dist/fonts'))

export const fonts = () => gulp.src('src/styles/fonts/*.woff2').pipe(gulp.dest('dist/fonts'))

export default gulp.series(gulp.parallel(stylesTokens, stylesTheme, stylesComponents, stylesAll, stylesFonts, fonts))
