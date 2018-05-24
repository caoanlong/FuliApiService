const Router = require('koa-router')
const router = new Router({prefix: '/sys_dict'})

const Sys_dict = require('../../models/sys_dict')

// 根据类型获取字典
router.get('/list/type', async ctx => {
	let { type } = ctx.query
	let where = {}
	if (type) {
		where['type'] = type
	}
	try {
		let result = await Sys_dict.findAll({ where })
		ctx.body = {
			code: 0,
			msg: '成功',
			data: result
		}
	} catch (err) {
		ctx.body = {
			code: -1,
			msg: err.toString()
		}
	}
})

module.exports = router