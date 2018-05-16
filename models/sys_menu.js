const Sequelize = require('sequelize')
const sequelize = require('../config/squelize')

/* 系统菜单 */
const Sys_menu = sequelize.define('sys_menu', {
	menu_id: {
		type: Sequelize.BIGINT(32),
		primaryKey: true,
		allowNull: false
	},
	menu_pid: {
		type: Sequelize.BIGINT(32)
	},
	name: {
		type: Sequelize.STRING(32),
		allowNull: false
	},
	route_name: {
		type: Sequelize.STRING(100),
		allowNull: false
	},
	path: {
		type: Sequelize.STRING(100),
		allowNull: false
	},
	icon: {
		type: Sequelize.STRING(100)
	},
	is_show: {
		type: Squelize.BOOLEAN,
		defaultValue: true
	},
	create_user_id: {
		type: Sequelize.STRING(32)
	},
	update_user_id: {
		type: Sequelize.STRING(32)
	},
	create_time: {
		type: Sequelize.DATE(),
		defaultValue: new Date()
	},
	update_time: {
		type: Sequelize.DATE(),
		defaultValue: new Date()
	}
})

module.exports = Sys_menu