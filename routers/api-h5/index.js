const Router = require('koa-router')
const router = new Router({prefix: '/api-h5'})
const jwt = require('jsonwebtoken')
const jwtConfig = require('../config/jwtConfig')

router.use(async (ctx, next) => {
	await next()
	return
	// 过滤登录路由
	if (ctx.url.includes('login')) {
		await next()
		return
	}
	const token = ctx.headers['x-access-token']
	if (token) {
		try {
			const decoded = await jwt.verify(token, jwtConfig.secret)
			if (decoded) {
				if (parseInt(Date.now()/1000) > decoded.exp) {
					ctx.body = {
						code: 104,
						msg: 'token已过期'
					}
				} else {
					ctx.state.member = decoded
					await next()
				}
			} else {
				ctx.body = {
					code: 103,
					msg: 'token非法'
				}
			}
		} catch (err) {
			ctx.body = {
				code: 102,
				msg: 'token解析失败'
			}
		}
	} else {
		ctx.body = {
			code: 101,
			msg: 'token不存在'
		}
	}
})

// router.use(require('./auth').routes())
// router.use(require('./sys_user').routes())
// router.use(require('./sys_role').routes())
// router.use(require('./sys_menu').routes())
// router.use(require('./sys_dict').routes())
router.use(require('./image').routes())

module.exports = router