if (process.env.NODE_ENV === 'production')
  module.exports = require('./configureBrowserStore.prod')
else
  module.exports = require('./configureBrowserStore.dev')
