module.exports = {
  output: 'export',
  exportPathMap: async function(defaultPathMap) {
    return {
      '/': { page: '/' }
    }
  }
}
