const Router = require('koa-router')
const router = new Router({prefix: '/sys_role'})
const { snowflake } = require('../../utils')

const Sys_role = require('../../models/sys_role')
const Sys_user = require('../../models/sys_user')

// 查看角色列表
router.get('/list', async ctx => {
	let data = ctx.query
	let pageIndex = Number(data.pageIndex || 1)
	let pageSize = Number(data.pageSize || 10)
	let offset = (pageIndex - 1) * pageSize
	let where = {}
	if (data['name']) {
		where['name'] = { $like: '%' + data['name'] + '%' }
	}
	try {
		let result = await Sys_role.findAndCountAll({
			where: where,
			offset: offset,
			limit: pageSize,
			order: [['create_time', 'DESC']],
			include: [
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

// 查看角色详情
router.get('/info', async ctx => {
	const role_id = ctx.query.role_id
	try {
		let result = await Sys_role.findById(role_id)
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

// 添加角色
router.post('/add', async ctx => {
	let user = ctx.state.user
	let data = ctx.request.body
	if (!data['name']) {
		ctx.body = {
			code: -1,
			msg: '名称不能为空'
		}
		return
	}
	data['role_id'] = snowflake.nextId()
	data['create_user_id'] = user.user_id
	data['update_user_id'] = user.user_id
	data['create_time'] = new Date()
	data['update_time'] = new Date()
	try {
		let result = await Sys_role.find({ where: { name: data['name'] }})
		if (result && result.role_id) {
			ctx.body = {
				code: -1,
				msg: '角色名已存在'
			}
			return
		} else {
			await Sys_role.create(data)
			ctx.body = {
				code: 0,
				msg: '成功'
			}
		}
	} catch (err) {
		ctx.body = {
			code: -1,
			msg: err.toString()
		}
	}
	
})

// 编辑角色
router.post('/update', async ctx => {
	let user = ctx.state.user
	let data = ctx.request.body
	if (!data['name']) {
		ctx.body = {
			code: -1,
			msg: '名称不能为空'
		}
		return
	}
	data['update_user_id'] = user.user_id
	data['update_time'] = new Date()
	try {
		let result = await Sys_role.find({ where: { name: data['name'] }})
		if (result.role_id) {
			ctx.body = {
				code: -1,
				msg: '角色名已存在'
			}
			return
		} else {
			await Sys_role.update(data, { where: { role_id: data['role_id'] } })
			ctx.body = {
				code: 0,
				msg: '成功'
			}
		}
	} catch (err) {
		ctx.body = {
			code: -1,
			msg: err.toString()
		}
	}
})

// 删除角色
router.post('/delete', async ctx => {
	let data = ctx.request.body
	try {
		await Sys_role.destroy({ where: { role_id: { $in: data['ids'] } } })
		ctx.body = {
			code: 0,
			msg: '成功'
		}
	} catch (err) {
		ctx.body = {
			code: -1,
			msg: err.toString()
		}
	}
})

module.exports = router