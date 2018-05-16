const Sequelize = require('sequelize')
const sequelize = require('../config/squelize')

/* 权限角色与菜单关联 */
const Sys_role_menu = sequelize.define('sys_role_menu', {
	role_id: {
		type: Sequelize.BIGINT(32),
		allowNull: false
	},
	menu_id: {
		type: Sequelize.STRING(32),
		allowNull: false
	}
})

module.exports = Sys_role_menu