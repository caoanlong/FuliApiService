const Router = require('koa-router')
const router = new Router({prefix: '/image'})
const { decodeToken } = require('../../utils')

const Image_src = require('../../models/image')
const Member = require('../../models/member')
const Image_like = require('../../models/image_like')

// 查看图片列表
router.get('/list', async ctx => {
	let data = ctx.query
	let pageIndex = Number(data.pageIndex || 1)
	let pageSize = Number(data.pageSize || 10)
	let offset = (pageIndex - 1) * pageSize
	let where = {
		'is_show': true
	}
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
			msg: err.toString()
		}
	}
})

// 查看图片详情
router.get('/info', async (ctx, next) => {
	let member_id = ''
	if (ctx.headers['x-access-token']) {
		await decodeToken(ctx, next)
		member_id = ctx.state.member.member_id
	}
	const image_id = ctx.query.image_id
	try {
		let image = await Image_src.findById(image_id)
		await Image_src.update({ view: Number(image.view) + 1 }, { where: { image_id } })
		let image_like = null
		if (member_id) {
			image_like = await Image_like.find({where: {image_id, member_id}})
		}
		let content = image['content'].split(',')
		let imgData = {
			image_id: image['image_id'],
			name: image['name'],
			thumbnail: image['thumbnail'],
			description: image['description'],
			like: image['like'],
			view: image['view'],
			level_id: image['level_id'],
			content: content,
			is_show: image['is_show']
		}
		if (image_like && image_like.member_id) {
			imgData['isLiked'] = true
		} else {
			imgData['isLiked'] = false
		}
		ctx.body = {
			code: 0,
			msg: '成功',
			data: imgData
		}
	} catch (err) {
		ctx.body = {
			code: -1,
			msg: err.toString()
		}
	}
})

// 图片点赞
router.post('/like', async ctx => {
	let member = ctx.state.member
	const member_id = member.member_id
	const { image_id } = ctx.request.body
	try {
		let image_like = await Image_like.find({where: { image_id, member_id }})
		if (image_like && image_like.member_id) {
			ctx.body = {
				code: -1,
				msg: '您已经喜欢过了'
			}
			return
		}
		let image = await Image_src.findById(image_id)
		await Image_src.update({ like: Number(image.like) + 1 }, { where: { image_id } })
		await Image_like.create({ image_id, member_id })
		ctx.body = {
			code: 0,
			msg: '成功'
		}
	} catch (err) {
		console.log(err)
		ctx.body = {
			code: -1,
			msg: err.toString()
		}
	}
})

module.exports = router