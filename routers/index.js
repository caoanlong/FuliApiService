const Router = require('koa-router')
const router = new Router({prefix: '/api'})

router.get('/', async ctx => {
	ctx.body = '哈哈'
})

router.use(require('./sys_user').routes())

module.exports = router