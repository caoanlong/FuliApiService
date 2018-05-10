const Koa = require('koa')
const logger = require('koa-logger')

const app = new Koa()
app.use(logger())
const sys_user = require('./models/sys_user')

module.exports = app