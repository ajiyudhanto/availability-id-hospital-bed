const path = require('path')

module.exports = {
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join('/styles/globals.scss', 'styles')],
  },
}
