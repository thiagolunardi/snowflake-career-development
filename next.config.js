const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  output: 'export',
  basePath: isProd ? '/snowflake-career-development' : '',
  assetPrefix: isProd ? '/snowflake-career-development' : '',
  exportPathMap: async function(defaultPathMap) {
    return {
      '/': { page: '/' }
    }
  }
}
