module.exports = {
  plugins: {
    'postcss-import': {},
    'postcss-cssnext': {
      browsers: ['last 2 versions', '> 1%', 'safari >= 9', 'ie >= 9'],
    },
  },
}
