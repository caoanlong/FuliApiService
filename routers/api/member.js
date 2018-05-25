const Router = require('koa-router')
const router = new Router({prefix: '/member'})

const Member = require('../../models/member')

// 查看会员列表
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
	if (data['is_disabled']) {
		where['is_disabled'] = data['is_disabled']
	}
	try {
		let result = await Member.findAndCountAll({
			where: where,
			offset: offset,
			limit: pageSize,
			order: [['create_time', 'DESC']],
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

// 查看会员详情
router.get('/info', async ctx => {
	const member_id = ctx.query.member_id
	try {
		let result = await Member.findById(member_id)
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

// 禁用会员
router.post('/disable', async ctx => {
	let { member_id, is_disabled } = ctx.request.body
	try {
		await Member.update({ is_disabled }, { where: { member_id } })
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