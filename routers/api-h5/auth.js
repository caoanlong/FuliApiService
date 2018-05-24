const Router = require('koa-router')
const router = new Router({prefix: '/auth'})
const jwt = require('jsonwebtoken')
const jwtConfig = require('../../config/jwtConfig')
const { snowflake, getVerCode } = require('../../utils')

const Member = require('../../models/member')
const VerCode = require('../../models/ver_code')

// 获取短信验证码
router.get('/getVerCode', async ctx => {
	let { mobile } = ctx.query
	if (!mobile) {
		ctx.body = {
			code: -1,
			msg: '手机号不能为空'
		}
		return
	}
	try {
		let result = await VerCode.find({ where: { mobile }})
		let newVerCode = getVerCode(4)
		if (result && result.ver_code_id) {
			await VerCode.update({
				ver_code: newVerCode,
				create_time: new Date()
			}, { where: { ver_code_id: result.ver_code_id } })
			ctx.body = {
				code: 0,
				msg: '成功',
				data: newVerCode
			}
		} else {
			await VerCode.create({
				ver_code_id: snowflake.nextId(),
				ver_code: newVerCode,
				mobile: mobile,
				create_time: new Date()
			})
			ctx.body = {
				code: 0,
				msg: '成功',
				data: newVerCode
			}
		}
	} catch (err) {
		ctx.body = {
			code: -1,
			msg: err.toString()
		}
	}
})

// 登录
router.post('/login', async ctx => {
	let { mobile, ver_code } = ctx.request.body
	if (!mobile) {
		ctx.body = {
			code: -1,
			msg: '手机号不能为空'
		}
		return
	}
	if (!ver_code) {
		ctx.body = {
			code: -1,
			msg: '验证码不能为空'
		}
		return
	}
	try {
		let result = await VerCode.find({ where: { mobile }})
		if (ver_code != result.ver_code) {
			ctx.body = {
				code: -1,
				msg: '验证码不正确'
			}
			return
		}
		let time = 120*1000
		let curTime = new Date().getTime()
		let addTime = new Date(result.create_time).getTime()
		if (curTime - addTime > time) {
			ctx.body = {
				code: -1,
				msg: '验证码已失效'
			}
			return
		}
		let member = await Member.find({ where: { mobile }})
		// 如果已注册
		if (member && member.mobile) {
			if (member['is_disabled']) {
				ctx.body = {
					code: -1,
					msg: '账号已禁用'
				}
				return
			}
			let payLoad = {
				member_id: member['member_id'],
				mobile: member['mobile'],
				glamour: member['glamour'],
				is_disabled: member['is_disabled']
			}
			let token = await jwt.sign(payLoad, jwtConfig.secret, jwtConfig.exp)
			ctx.set({'X-Access-Token': token})
			ctx.body = {
				code: 0,
				msg: '成功'
			}
			return
		}
		// 如果不存在
		const member_id = snowflake.nextId()
		await Member.create({
			member_id,
			mobile,
			create_time: new Date(),
			update_time: new Date()
		})
		let payLoad = {
			member_id,
			mobile,
			glamour: 1,
			is_disabled: false
		}
		let token = await jwt.sign(payLoad, jwtConfig.secret, jwtConfig.exp)
		ctx.set({'X-Access-Token': token})
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

// 获取会员信息
router.get('/memberInfo', async ctx => {
	let member = ctx.state.member
	const member_id = member.member_id
	try {
		let result = await Member.findById(member_id)
		if (result && result.member_id) {
			ctx.body = {
				code: 0,
				msg: '成功',
				data: result
			}
		}
	} catch (err) {
		ctx.body = {
			code: -1,
			msg: err.toString()
		}
	}
})

module.exports = router