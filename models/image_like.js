const Sequelize = require('sequelize')
const sequelize = require('../config/squelize')

/* 会员点赞图片 */
const Image_like = sequelize.define('image_like', {
	image_id: {
		type: Sequelize.BIGINT(32),
		allowNull: false
	},
	member_id: {
		type: Sequelize.BIGINT(32),
		allowNull: false
	}
})

// Image_like.sync()

module.exports = Image_like