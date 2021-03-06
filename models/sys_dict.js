const Sequelize = require('sequelize')
const sequelize = require('../config/squelize')

const Sys_user = require('./sys_user')

/* 系统字典 */
const Sys_dict = sequelize.define('sys_dict', {
	dict_id: {
		type: Sequelize.BIGINT(32),
		primaryKey: true,
		allowNull: false
	},
	key: {
		type: Sequelize.STRING(100),
		allowNull: false
	},
	value: {
		type: Sequelize.STRING(100),
		allowNull: false
	},
	glamour: {
		type: Sequelize.BIGINT(32)
	},
	type: {
		type: Sequelize.STRING(100),
		allowNull: false
	},
	sort: {
		type: Sequelize.BIGINT(10),
		defaultValue: 1
	},
	description: {
		type: Sequelize.STRING(500)
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

// Sys_dict.sync({force: true})
Sys_dict.belongsTo(Sys_user, {as: 'create_user', foreignKey: 'create_user_id'})
Sys_dict.belongsTo(Sys_user, {as: 'update_user', foreignKey: 'update_user_id'})

module.exports = Sys_dict