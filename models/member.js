const Sequelize = require('sequelize')
const sequelize = require('../config/squelize')

/* 会员 */
const Member = sequelize.define('member', {
	member_id: {
		type: Sequelize.BIGINT(32),
		primaryKey: true,
		allowNull: false
	},
	avatar: {
		type: Sequelize.STRING(1024)
	},
	glamour: {
		type: Sequelize.BIGINT(32),
		defaultValue: 1
	},
	name: {
		type: Sequelize.STRING(32)
	},
	mobile: {
		type: Sequelize.STRING(16),
		unique: true,
		allowNull: false
	},
	is_disabled: {
		type: Sequelize.BOOLEAN,
		defaultValue: false
	},
	create_time: {
		type: Sequelize.DATE()
	},
	update_time: {
		type: Sequelize.DATE()
	}
})

// Member.sync()

module.exports = Member