var gulp = require("gulp"),
  del = require('del'),
  iconfont = require('gulp-iconfont'),
  consolidate = require('gulp-consolidate'),
  githubPages = require('gulp-gh-pages');

var ICONS = './icons',
  TEMPLATES = './templates',
  DIST = './dist',

  fontName = 'locals-icons2',
  className = 'icon2'

  config = {
    clean: {
      src: [DIST]
    },
    githubPages: {
      src: DIST + '/**/*',
      options: {
        message: 'gh-pages'
      }
    },
    icons: {
      src: ICONS + '/*.svg'
    },
    iconfont: {
      cssFontPath: './',
      options: {
        fontName: fontName,
        normalize: true,
        formats: ['eot', 'ttf', 'woff', 'woff2', 'svg']
      },
      dest: DIST
    },
    templates: {
      html: {
        src: TEMPLATES + '/locals-icons2.html',
        dest: DIST
      },
      css: {
        src: TEMPLATES + '/locals-icons2.css',
        dest: DIST
      }
    },
  };

gulp.task('clean', function(){
  del(config.clean.src);
});

gulp.task('iconfont', function(){
  return gulp.src(config.icons.src)
    .pipe(iconfont(config.iconfont.options))
    .on('glyphs', function(glyphs, options){
      gulp.src(config.templates.css.src)
        .pipe(consolidate('lodash', {
          glyphs: glyphs,
          fontName: fontName,
          fontPath: config.iconfont.cssFontPath,
          className: className
        }))
        .pipe(gulp.dest(config.templates.css.dest));

      gulp.src(config.templates.html.src)
        .pipe(consolidate('lodash', {
          glyphs: glyphs,
          className: className
        }))
        .pipe(gulp.dest(config.templates.html.dest));
    })
    .pipe(gulp.dest(config.iconfont.dest));
})

gulp.task('deploy', ['dist'], function(){
  return gulp.src(config.githubPages.src)
    .pipe(githubPages(config.githubPages.options));
})

gulp.task('dist', ['clean'], function(cb){
  gulp.start('iconfont');
});

gulp.task('default', ['dist']);