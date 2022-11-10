const { merge } = require('webpack-merge')
const common = require('./webpack.common')

module.exports = (envs) => {
  const { env } = envs
  const patch = require(`./webpack.${env}.js`)
  const config = merge(common, patch)
  return config
}
