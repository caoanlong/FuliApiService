const crypto = require('crypto')

exports.snowflake = require('node-snowflake').Snowflake

exports.generatePassword = (password) => {
	const key = crypto.pbkdf2Sync(password, 'xxoo_longge19890204_fuck', 1000, 32, 'sha256')
	return key.toString('hex')
}