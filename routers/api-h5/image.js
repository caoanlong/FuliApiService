const Router = require('koa-router')
const router = new Router({prefix: '/image'})

const Image_src = require('../../models/image')

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
		await Image_src.update({ view: Number(result.view) + 1 }, { where: { image_id } })
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

// 图片点赞
router.post('/like', async ctx => {
	const { image_id } = ctx.request.body
	try {
		let result = await Image_src.findById(image_id)
		await Image_src.update({ like: Number(result.like) + 1 }, { where: { image_id } })
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