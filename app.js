const Koa = require('koa')
const logger = require('koa-logger')
const bodyParser = require('koa-bodyparser')

const router = require('./routers')

const app = new Koa()
app.use(logger())
app.use(bodyParser())

app.use(async function(ctx, next) {
	ctx.set("Access-Control-Allow-Origin", "*")
	// ctx.set("Access-Control-Allow-Origin", ctx.request.header.origin)
	// ctx.set("Access-Control-Allow-Credentials", true)
	// ctx.set("Access-Control-Max-Age", 86400000)
	// ctx.set("Access-Control-Allow-Methods", "OPTIONS, GET, PUT, POST, DELETE")
	// ctx.set("Access-Control-Allow-Headers", "x-requested-with, accept, origin, content-type")
	await next()
})

app.use(router.routes())

module.exports = app