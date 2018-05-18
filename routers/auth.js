const Router = require('koa-router')
const router = new Router({prefix: '/auth'})
const jwt = require('jsonwebtoken')
const { generatePassword } = require('../utils')
const jwtConfig = require('../config/jwtConfig')

const Sys_user = require('../models/sys_user')

// 登录
router.post('/login', async ctx => {
	let data = ctx.request.body
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
	try {
		let result = await Sys_user.find({ where: { mobile: data['mobile'] }})
		if (result && result.password == generatePassword(data['password'])) {
			if (result['is_disabled']) {
				ctx.body = {
					code: -1,
					msg: '账号已禁用'
				}
				return
			}
			let payLoad = {
				user_id: result['user_id'],
				avatar: result['avatar'],
				name: result['name'],
				mobile: result['mobile'],
				role_id: result['role_id'],
				is_disabled: result['is_disabled'],
				create_user_id: result['create_user_id'],
				create_time: result['create_time'],
				update_user_id: result['update_user_id'],
				update_time: result['update_time']
			}
			let token = await jwt.sign(payLoad, jwtConfig.secret, jwtConfig.exp)
			ctx.set({'X-Access-Token': token})
			ctx.body = {
				code: 0,
				msg: '成功'
			}
		} else {
			ctx.body = {
				code: -1,
				msg: '账号或密码错误'
			}
		}
	} catch (err) {
		console.log(err)
		ctx.body = {
			code: -1,
			msg: err.name
		}
	}
})

// 获取用户信息
router.get('/userInfo', async ctx => {
	let user = ctx.state.user
	const user_id = user.user_id
	try {
		let result = await Sys_user.findById(user_id)
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

module.exports = router