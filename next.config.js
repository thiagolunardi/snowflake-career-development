module.exports = {
  output: 'export',
  basePath: '/snowflake-career-development',
  assetPrefix: '/snowflake-career-development',
  exportPathMap: async function(defaultPathMap) {
    return {
      '/': { page: '/' }
    }
  }
}
