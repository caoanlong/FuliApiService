const Koa = require('koa')
const logger = require('koa-logger')
const bodyParser = require('koa-bodyparser')
const cors = require('koa2-cors')

const router = require('./routers')

const app = new Koa()

app.use(bodyParser())
app.use(logger())

app.use(cors({
	origin: function (ctx) {
		if (ctx.url === '/test') {
			return "*"; // 允许来自所有域名请求
		}
		return ctx.request.header.origin
		// return 'http://localhost:8080' // 这样就能只允许 http://localhost:8080 这个域名的请求了
	},
	exposeHeaders: ['Accept', 'X-Access-Token'],
	allowMethods: ['GET', 'POST', 'DELETE', 'PUT', 'OPTIONS'],
	allowHeaders: ['Content-Type', 'Accept', 'X-Access-Token']
}))

app.use(router.routes())

module.exports = app