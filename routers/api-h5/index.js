const Router = require('koa-router')
const router = new Router({prefix: '/api-h5'})
const jwt = require('jsonwebtoken')
const jwtConfig = require('../../config/jwtConfig')
const { decodeToken } = require('../../utils')

router.use(async (ctx, next) => {
	// await next()
	// return
	// 过滤登录路由
	if (   ctx.url.includes('login') 
		|| ctx.url.includes('getVerCode') 
		|| ctx.url.includes('image/list') 
		|| ctx.url.includes('image/info')
		|| ctx.url.includes('sys_dict/list/type')
		) {
		await next()
		return
	}
	await decodeToken(ctx, next)
})

router.use(require('./auth').routes())
router.use(require('./image').routes())
router.use(require('./sys_dict').routes())

module.exports = router