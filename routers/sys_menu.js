const Router = require('koa-router')
const router = new Router({prefix: '/sys_menu'})
const { snowflake, menusTree } = require('../utils')

const Sys_menu = require('../models/sys_menu')
const Sys_user = require('../models/sys_user')
const Sys_role = require('../models/sys_role')

// 获取所有菜单
router.get('/list/all', async ctx => {
	try {
		let result = await Sys_menu.findAll()
		let menus = await menusTree(result)
		ctx.body = {
			code: 0,
			msg: '成功',
			data: menus
		}
	} catch (err) {
		console.log(err)
		ctx.body = {
			code: -1,
			msg: err.name
		}
	}
})

// 根据权限获取菜单列表
router.get('/list', async ctx => {
	let user = ctx.state.user
	const user_id = user.user_id
	try {
		let userInfo = await Sys_user.findById(user_id)
		let roleInfo = await userInfo.getSys_role()
		let menuList = await roleInfo.getSys_menus()
		let permissions = await menuList.map(item => item.route_name)
		let menus = await menusTree(menuList)
		ctx.body = {
			code: 0,
			msg: '成功',
			data: menus,
			permissions
		}
	} catch (err) {
		ctx.body = {
			code: -1,
			msg: err.name
		}
	}
})

// 获取菜单详情
router.get('/info', async ctx => {
	let menu_id = ctx.query.menu_id
	try {
		let menuInfo = await Sys_menu.findById(menu_id)
		let roles = await menuInfo.getSys_roles()
		menuInfo.roles = roles
		ctx.body = {
			code: 0,
			msg: '成功',
			data: menuInfo
		}
	} catch (err) {
		ctx.body = {
			code: -1,
			msg: err.name
		}
	}
})

// 添加菜单
router.post('/add', async ctx => {
	let user = ctx.state.user
	let data = ctx.request.body
	data['menu_id'] = snowflake.nextId()
	data['create_user_id'] = user.user_id
	data['update_user_id'] = user.user_id
	try {
		await Sys_menu.create(data)
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

// 编辑菜单
router.post('/update', async ctx => {
	let user = ctx.state.user
	let data = ctx.request.body
	data['update_user_id'] = user.user_id
	data['update_time'] = new Date()
	try {
		await Sys_menu.update(data, { where: { menu_id: data['menu_id'] } })
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

// 删除菜单
router.post('/delete', async ctx => {
	let data = ctx.request.body
	try {
		await Sys_menu.destroy({ where: { menu_id: { $in: data['ids'] } } })
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