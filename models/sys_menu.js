const Sequelize = require('sequelize')
const sequelize = require('../config/squelize')

const Sys_role = require('./sys_role')
const Sys_role_menu = require('./sys_role_menu')

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
	sort: {
		type: Sequelize.BIGINT(10),
		defaultValue: 1
	},
	is_show: {
		type: Sequelize.BOOLEAN,
		defaultValue: true
	},
	create_user_id: {
		type: Sequelize.BIGINT(32)
	},
	update_user_id: {
		type: Sequelize.BIGINT(32)
	},
	create_time: {
		type: Sequelize.DATE()
	},
	update_time: {
		type: Sequelize.DATE()
	}
})

// Sys_menu.sync()
Sys_menu.belongsToMany(Sys_role, {through: Sys_role_menu, foreignKey: 'menu_id'})
Sys_role.belongsToMany(Sys_menu, {through: Sys_role_menu, foreignKey: 'role_id'})

module.exports = Sys_menu