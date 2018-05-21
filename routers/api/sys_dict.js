const Router = require('koa-router')
const router = new Router({prefix: '/sys_dict'})
const { snowflake } = require('../utils')

const Sys_dict = require('../models/sys_dict')
const Sys_user = require('../models/sys_user')

// 查看字典列表
router.get('/list', async ctx => {
	let data = ctx.query
	let pageIndex = Number(data.pageIndex || 1)
	let pageSize = Number(data.pageSize || 10)
	let offset = (pageIndex - 1) * pageSize
	let where = {}
	if (data['type']) {
		where['type'] = data['type']
	}
	if (data['description']) {
		where['description'] = { $like: '%' + data['description'] + '%' }
	}
	try {
		let result = await Sys_dict.findAndCountAll({
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
		console.log(err)
		ctx.body = {
			code: -1,
			msg: err.name
		}
	}
})

// 查看字典详情
router.get('/info', async ctx => {
	const dict_id = ctx.query.dict_id
	try {
		let result = await Sys_dict.findById(dict_id)
		ctx.body = {
			code: 0,
			msg: '成功',
			data: result
		}
	} catch (err) {
		console.log(err)
		ctx.body = {
			code: -1,
			msg: err.name
		}
	}
})

// 添加字典
router.post('/add', async ctx => {
	let user = ctx.state.user
	let data = ctx.request.body
	if (!data['key']) {
		ctx.body = {
			code: -1,
			msg: '键不能为空'
		}
		return
	}
	if (!data['value']) {
		ctx.body = {
			code: -1,
			msg: '值不能为空'
		}
		return
	}
	if (!data['type']) {
		ctx.body = {
			code: -1,
			msg: '类型不能为空'
		}
		return
	}
	data['dict_id'] = snowflake.nextId()
	data['create_user_id'] = user.user_id
	data['update_user_id'] = user.user_id
	try {
		await Sys_dict.create(data)
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

// 编辑字典
router.post('/update', async ctx => {
	let user = ctx.state.user
	let data = ctx.request.body
	if (!data['key']) {
		ctx.body = {
			code: -1,
			msg: '键不能为空'
		}
		return
	}
	if (!data['value']) {
		ctx.body = {
			code: -1,
			msg: '值不能为空'
		}
		return
	}
	if (!data['type']) {
		ctx.body = {
			code: -1,
			msg: '类型不能为空'
		}
		return
	}
	data['update_user_id'] = user.user_id
	data['update_time'] = new Date()
	try {
		await Sys_dict.update(data, { where: { dict_id: data['dict_id'] } })
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

// 删除字典
router.post('/delete', async ctx => {
	let data = ctx.request.body
	try {
		await Sys_dict.destroy({ where: { dict_id: { $in: data['ids'] } } })
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

// 字典类型列表
router.get('/type', async ctx => {
	try {
		let result = await Sys_dict.findAll({
			attributes: ['type', 'description'],
			group: ['type']
		})
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

// 根据类型获取字典
router.get('/list/type', async ctx => {
	let { type } = ctx.query
	try {
		let result = await Sys_dict.findAll({
			where: { type }
		})
		ctx.body = {
			code: 0,
			msg: '成功',
			data: result
		}
	} catch (err) {
		console.log(err)
		ctx.body = {
			code: -1,
			msg: err.name
		}
	}
})

module.exports = router