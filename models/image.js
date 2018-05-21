const Sequelize = require('sequelize')
const sequelize = require('../config/squelize')

const Sys_user = require('./sys_user')
const Sys_dict = require('./sys_dict')

/* 图片 */
const Image_src = sequelize.define('image_src', {
	image_id: {
		type: Sequelize.BIGINT(32),
		primaryKey: true,
		allowNull: false
	},
	name: {
		type: Sequelize.STRING(128),
		allowNull: false
	},
	thumbnail: {
		type: Sequelize.STRING(500),
		allowNull: false
	},
	description: {
		type: Sequelize.STRING(255)
	},
	like: {
		type: Sequelize.BIGINT(32),
		defaultValue: 0
	},
	view: {
		type: Sequelize.BIGINT(32),
		defaultValue: 0
	},
	level_id: {
		type: Sequelize.BIGINT(32),
		allowNull: false
	},
	content: {
		type: Sequelize.STRING(2000),
		allowNull: false
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
		type: Sequelize.DATE(),
		defaultValue: new Date()
	},
	update_time: {
		type: Sequelize.DATE(),
		defaultValue: new Date()
	}
})

// Image_src.sync({force: true})
Image_src.belongsTo(Sys_dict, {as: 'level', foreignKey: 'level_id'})
Image_src.belongsTo(Sys_user, {as: 'create_user', foreignKey: 'create_user_id'})
Image_src.belongsTo(Sys_user, {as: 'update_user', foreignKey: 'update_user_id'})

module.exports = Image_src