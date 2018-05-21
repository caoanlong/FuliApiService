const Router = require('koa-router')
const router = new Router({prefix: '/image'})
const { snowflake } = require('../utils')

const Image_src = require('../models/image')
const Sys_user = require('../models/sys_user')
const Sys_dict = require('../models/sys_dict')

// 查看图片列表
router.get('/list', async ctx => {
	let data = ctx.query
	let pageIndex = Number(data.pageIndex || 1)
	let pageSize = Number(data.pageSize || 10)
	let offset = (pageIndex - 1) * pageSize
	let where = {}
	if (data['name']) {
		where['name'] = { $like: '%' + data['name'] + '%' }
	}
	if (data['level_id']) {
		where['level_id'] =  data['level_id']
	}
	if (data['is_show'] == 'true') {
		where['is_show'] = true
	} else if (data['is_show'] == 'false') {
		where['is_show'] = false
	}
	try {
		let result = await Image_src.findAndCountAll({
			where: where,
			offset: offset,
			limit: pageSize,
			order: [['create_time', 'DESC']],
			include: [
				{ 
					model: Sys_dict, 
					as: 'level' 
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

// 查看图片详情
router.get('/info', async ctx => {
	const image_id = ctx.query.image_id
	try {
		let result = await Image_src.findById(image_id, {
			include: [
				{ 
					model: Sys_dict, 
					as: 'level' 
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

// 添加图片
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
	if (!data['thumbnail']) {
		ctx.body = {
			code: -1,
			msg: '缩略图不能为空'
		}
		return
	}
	if (!data['level_id']) {
		ctx.body = {
			code: -1,
			msg: '级别不能为空'
		}
		return
	}
	if (!data['content']) {
		ctx.body = {
			code: -1,
			msg: '内容不能为空'
		}
		return
	}
	data['image_id'] = snowflake.nextId()
	data['create_user_id'] = user.user_id
	data['update_user_id'] = user.user_id
	try {
		await Image_src.create(data)
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

// 编辑图片
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
	if (!data['thumbnail']) {
		ctx.body = {
			code: -1,
			msg: '缩略图不能为空'
		}
		return
	}
	if (!data['level_id']) {
		ctx.body = {
			code: -1,
			msg: '级别不能为空'
		}
		return
	}
	if (!data['content']) {
		ctx.body = {
			code: -1,
			msg: '内容不能为空'
		}
		return
	}
	data['update_user_id'] = user.user_id
	data['update_time'] = new Date()
	try {
		await Image_src.update(data, { where: { image_id: data['image_id'] } })
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

// 删除图片
router.post('/delete', async ctx => {
	let data = ctx.request.body
	try {
		await Image_src.destroy({ where: { image_id: { $in: data['ids'] } } })
		ctx.body = {
			code: 0,
			msg: '成功'
		}
	} catch (err) {
		console.log(err)
		ctx.body = {
			code: -1,
			msg: err.name
		}
	}
})

// 隐藏图片
router.post('/hide', async ctx => {
	let { image_id, is_show } = ctx.request.body
	try {
		await Image_src.update({ is_show }, { where: { image_id } })
		ctx.body = {
			code: 0,
			msg: '成功'
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