const Sequelize = require('sequelize')
const sequelize = require('../config/squelize')

/* 短信验证码 */
const VerCode = sequelize.define('ver_code', {
	ver_code_id: {
		type: Sequelize.BIGINT(32),
		primaryKey: true,
		allowNull: false
	},
	ver_code: {
		type: Sequelize.STRING(8),
		allowNull: false
	},
	mobile: {
		type: Sequelize.STRING(16),
		allowNull: false
	},
	create_time: {
		type: Sequelize.DATE()
	}
})

// VerCode.sync()

module.exports = VerCode