const { environment } = require('@rails/webpacker')
const typescript =  require('./loaders/typescript')

environment.loaders.append('typescript', typescript)
module.exports = environment
