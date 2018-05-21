const Router = require('koa-router')
const router = new Router({prefix: '/image'})
const { snowflake } = require('../utils')

const Image_src = require('../models/image')
const Sys_dict = require('../models/sys_dict')

// 查看图片列表
router.get('/list', async ctx => {
	let data = ctx.query
	let pageIndex = Number(data.pageIndex || 1)
	let pageSize = Number(data.pageSize || 10)
	let offset = (pageIndex - 1) * pageSize
	let where = {}
	if (data['level_id']) {
		where['level_id'] =  data['level_id']
	}
	try {
		let result = await Image_src.findAndCountAll({
			where: where,
			offset: offset,
			limit: pageSize,
			order: [['create_time', 'DESC']]
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
		let result = await Image_src.findById(image_id)
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