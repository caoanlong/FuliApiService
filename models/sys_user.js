const Sequelize = require('sequelize')
const sequelize = require('../config/squelize')

const Sys_role = require('./sys_role')

/* 系统用户 */
const Sys_user = sequelize.define('sys_user', {
	user_id: {
		type: Sequelize.BIGINT(32),
		primaryKey: true,
		allowNull: false
	},
	avatar: {
		type: Sequelize.STRING(1024)
	},
	name: {
		type: Sequelize.STRING(32),
		allowNull: false
	},
	mobile: {
		type: Sequelize.STRING(16),
		unique: true,
		allowNull: false
	},
	password: {
		type: Sequelize.STRING(255),
		allowNull: false
	},
	role_id: {
		type: Sequelize.BIGINT(32)
	},
	is_disabled: {
		type: Sequelize.BOOLEAN,
		defaultValue: false
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

Sys_user.belongsTo(Sys_role, {as: 'sys_role', foreignKey: 'role_id'})
Sys_role.belongsTo(Sys_user, {as: 'create_user', foreignKey: 'create_user_id'})
Sys_role.belongsTo(Sys_user, {as: 'update_user', foreignKey: 'update_user_id'})
Sys_user.belongsTo(Sys_user, {as: 'create_user', foreignKey: 'create_user_id'})
Sys_user.belongsTo(Sys_user, {as: 'update_user', foreignKey: 'update_user_id'})

module.exports = Sys_user