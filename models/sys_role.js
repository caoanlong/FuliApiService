const Sequelize = require('sequelize')
const sequelize = require('../config/squelize')

const Sys_user = require('./sys_user')

/* 系统角色 */
const Sys_role = sequelize.define('sys_role', {
	role_id: {
		type: Sequelize.BIGINT(32),
		primaryKey: true,
		allowNull: false
	},
	name: {
		type: Sequelize.STRING(32),
		allowNull: false
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

module.exports = Sys_role