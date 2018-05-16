const Router = require('koa-router')
const router = new Router({prefix: '/sys_user'})
const { snowflake } = require('../utils')

const Sys_user = require('../models/sys_user')

// 查看用户列表
router.get('/list', async ctx => {
	let data = ctx.query
	let pageIndex = Number(data.pageIndex || 1)
	let pageSize = Number(data.pageSize || 10)
	let offset = (pageIndex - 1) * pageSize
	let where = {}
	if (data['name']) {
		where['name'] = { $like: '%' + data['name'] + '%' }
	}
	if (data['mobile']) {
		where['mobile'] = { $like: '%' + data['mobile'] + '%' }
	}
	if (data['is_disabled'] == 'true') {
		where['is_disabled'] = true
	} else if (data['is_disabled'] == 'false') {
		where['is_disabled'] = false
	}
	let result = await Sys_user.findAndCountAll({
		where: where,
		offset: offset,
		limit: pageSize,
		order: [['create_time', 'DESC']]
	})
	if (result) {
		ctx.body = {
			code: 0,
			msg: '成功',
			data: result
		}
	} else {
		ctx.body = {
			code: -1,
			msg: '失败'
		}
	}
})

// 查看用户详情
router.get('/info', async ctx => {
	const user_id = ctx.query.user_id
	let result = await Sys_user.findById(user_id)
	if (result) {
		ctx.body = {
			code: 0,
			msg: '成功',
			data: result
		}
	} else {
		ctx.body = {
			code: -1,
			msg: '失败'
		}
	}
})

// 添加用户
router.post('/add', async ctx => {
	let data = ctx.request.body
	if (!data['name']) {
		ctx.body = {
			code: -1,
			msg: '姓名不能为空'
		}
		return
	}
	if (!data['mobile']) {
		ctx.body = {
			code: -1,
			msg: '手机不能为空'
		}
		return
	}
	if (!data['password']) {
		ctx.body = {
			code: -1,
			msg: '密码不能为空'
		}
		return
	}
	data['user_id'] = snowflake.nextId()
	await Sys_user.create(data)
	ctx.body = {
		code: 0,
		msg: '成功'
	}
})
module.exports = router