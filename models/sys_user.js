const Sequelize = require('sequelize')
const sequelize = require('../config/squelize')

/* 系统用户 */
const Sys_user = sequelize.define('sys_user', {
	user_id: {
		type: Sequelize.BIGINT(32),
		primaryKey: true,
		allowNull: false
    },
    name: {
        type: Sequelize.STRING(32),
        allowNull: false
    },
    mobile: {
        type: Sequelize.STRING(16)
    },
    login_name: {
        type: Sequelize.STRING(32),
        allowNull: false
    },
    password: {
        type: Sequelize.STRING(255),
        allowNull: false
    },
})
