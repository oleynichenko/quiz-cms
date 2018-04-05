const gulp = require(`gulp`);
const sass = require(`gulp-sass`);
const plumber = require(`gulp-plumber`);
const postcss = require(`gulp-postcss`);
const autoprefixer = require(`autoprefixer`);
const rollup = require(`gulp-better-rollup`);
const nodemon = require(`gulp-nodemon`);
const rename = require(`gulp-rename`);
const server = require(`browser-sync`).create();

const componentFolder = `test`;

gulp.task(`style`, function () {
  gulp.src(`front/sass/style.scss`)
      .pipe(plumber())
      .pipe(sass())
      .pipe(postcss([
        autoprefixer({browsers: [
          `last 1 version`,
          `last 2 Chrome versions`,
          `last 2 Firefox versions`,
          `last 2 Opera versions`,
          `last 2 Edge versions`
        ]})
      ]))
      // .pipe(minify())
      .pipe(gulp.dest(`static/css`))
      .pipe(server.stream());
});

gulp.task(`style-component`, function () {
  gulp.src(`./front/components/${componentFolder}/sass/style.scss`)
      .pipe(plumber())
      .pipe(sass())
      .pipe(postcss([
        autoprefixer({browsers: [
          `last 1 version`,
          `last 2 Chrome versions`,
          `last 2 Firefox versions`,
          `last 2 Opera versions`,
          `last 2 Edge versions`
        ]})
      ]))
      .pipe(gulp.dest(`./front/components/${componentFolder}`))
      .pipe(rename(`test.css`))
      .pipe(gulp.dest(`static/css`))
      .pipe(server.stream());
});

gulp.task(`scripts-component`, function () {
  gulp.src(`front/components/${componentFolder}/js/index.js`)
      .pipe(plumber())
      .pipe(rollup({}, `iife`))
      .pipe(gulp.dest(`front/components/${componentFolder}`))
      .pipe(rename(`test.js`))
      .pipe(gulp.dest(`static/js`));
});

gulp.task(`scripts`, function () {
  gulp.src(`front/js/index.js`)
      .pipe(plumber())
      .pipe(rollup({}, `iife`))
      .pipe(gulp.dest(`static/js`));
});

gulp.task(`nodemon`, function (cb) {
  let started = false;

  return nodemon({
    script: `index.js`,
    args: [`--server`],
    ext: `js json pug css`,
    ignore: [
      `node_modules/`,
      `front/*`,
      `static/*`,
      `src/server/templates/*`,
      `src/**/*.log`
    ]
  }).on(`start`, function () {
    if (!started) {
      cb();
      started = true;
    }
  });
});

gulp.task(`nodemon-sync`, function (cb) {
  let started = false;

  return nodemon({
    script: `index.js`,
    args: [`--server`],
    ext: `js json pug css`,
    ignore: [
      `node_modules/`,
      `front/*`,
      `static/*`,
      `src/server/templates/*`,
      `src/**/*.log`
    ]
  }).on(`start`, function () {
    if (!started) {
      cb();
      started = true;

      server.init({
        proxy: `localhost:3000`,
        reloadDelay: 3000,
        port: 8080,
      });

      console.log(2222222222222);
    }

    server.reload();
  });
});

gulp.task(`browser-sync`, function () {
  server.init({
    server: {
      baseDir: `./front/components/`,
      index: `./${componentFolder}/index.html`,
      port: 8080
    }
  });
});

gulp.task(`watch`, function () {
  gulp.watch(`front/sass/**/*.scss`, [`style`]);
  gulp.watch(`front/js/**/*.js`, [`scripts`]).on(`change`, server.reload);
});

gulp.task(`watch-component`, function () {
  gulp.watch(`./front/components/${componentFolder}/sass/**/*.scss`, [`style-component`]);
  gulp.watch(`./front/components/${componentFolder}/*.html`).on(`change`, server.reload);
  gulp.watch(`./front/components/${componentFolder}/js/**/*.js`, [`scripts-component`]).on(`change`, server.reload);
});

gulp.task(`start`, [`watch`, `style`, `scripts`, `nodemon-sync`]);
gulp.task(`start-component`, [`watch-component`, `style-component`, `scripts-component`, `browser-sync`]);


