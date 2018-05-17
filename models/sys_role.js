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
		type: Sequelize.DATE(),
		defaultValue: new Date()
	},
	update_time: {
		type: Sequelize.DATE(),
		defaultValue: new Date()
	}
})


// Sys_role.belongsTo(Sys_user, {as: 'create_user', foreignKey: 'create_user_id'})
// Sys_role.hasOne(Sys_user, {as: 'update_user', foreignKey: 'update_user_id'})

module.exports = Sys_role