const Router = require('koa-router')
const router = new Router({prefix: '/sys_user'})
const { snowflake, generatePassword } = require('../utils')

const Sys_user = require('../models/sys_user')
const Sys_role = require('../models/sys_role')

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
	try {
		let result = await Sys_user.findAndCountAll({
			where: where,
			offset: offset,
			limit: pageSize,
			order: [['create_time', 'DESC']],
			include: [
				{ 
					model: Sys_role, 
					as: 'sys_role' 
				},
				{ 
					model: Sys_user, 
					as: 'create_user' 
				},
				{ 
					model: Sys_user, 
					as: 'update_user' 
				}
			]
		})
		for (let i = 0; i < result.rows.length; i++) {
			result.rows[i].password = ''
		}
		ctx.body = {
			code: 0,
			msg: '成功',
			data: result
		}
	} catch (err) {
		ctx.body = {
			code: -1,
			msg: err.name
		}
	}
})

// 查看用户详情
router.get('/info', async ctx => {
	const user_id = ctx.query.user_id
	try {
		let result = await Sys_user.findById(user_id, {
			include: [
				{ 
					model: Sys_role, 
					as: 'sys_role' 
				},
				{ 
					model: Sys_user, 
					as: 'create_user' 
				},
				{ 
					model: Sys_user, 
					as: 'update_user' 
				}
			]
		})
		if (result) {
			result.password = ''
			ctx.body = {
				code: 0,
				msg: '成功',
				data: result
			}
		}
	} catch (err) {
		ctx.body = {
			code: -1,
			msg: err.name
		}
	}
})

// 添加用户
router.post('/add', async ctx => {
	let user = ctx.state.user
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
	} else {
		data['password'] = generatePassword(data['password'])
	}
	data['user_id'] = snowflake.nextId()
	data['create_user_id'] = user.user_id
	data['update_user_id'] = user.user_id
	try {
		await Sys_user.create(data)
		ctx.body = {
			code: 0,
			msg: '成功'
		}
	} catch (err) {
		ctx.body = {
			code: -1,
			msg: err.name
		}
	}
})

// 编辑用户
router.post('/update', async ctx => {
	let user = ctx.state.user
	let data = ctx.request.body
	let property = {
		avatar: data['avatar'],
		name: data['name'],
		mobile: data['mobile'],
		role_id: data['role_id'],
		is_disabled: data['is_disabled'],
		update_user_id: null,
		update_time: new Date()
	}
	if (data['password']) {
		property['password'] = generatePassword(data['password'])
	}
	data['update_user_id'] = user.user_id
	try {
		await Sys_user.update(property, { where: { user_id: data['user_id'] } })
		ctx.body = {
			code: 0,
			msg: '成功'
		}
	} catch (err) {
		ctx.body = {
			code: -1,
			msg: err.name
		}
	}
})

// 删除用户
router.post('/delete', async ctx => {
	let data = ctx.request.body
	let ids = data['ids'].split(',')
	try {
		await Sys_user.destroy({ where: { user_id: { $in: ids } } })
		ctx.body = {
			code: 0,
			msg: '成功'
		}
	} catch (err) {
		ctx.body = {
			code: -1,
			msg: err.name
		}
	}
})
module.exports = router