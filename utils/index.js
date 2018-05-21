const crypto = require('crypto')

exports.snowflake = require('node-snowflake').Snowflake

exports.generatePassword = (password) => {
	const key = crypto.pbkdf2Sync(password, 'xxoo_longge19890204_fuck', 1000, 32, 'sha256')
	return key.toString('hex')
}

exports.menusTree = (source) => {
	let data = source.map(item => {
		let obj = Object.assign({}, item.dataValues)
		delete obj['sys_role_menu']
		return obj
	})
	let json = [], hash = {}
	return new Promise((resolve, reject) => {
		for (let i = 0; i < data.length; i++) {
			hash[data[i].menu_id] = data[i]
		}
		let hashVP
		for (let j = 0; j < data.length; j++) {
			hashVP = hash[data[j].menu_pid]
			if (hashVP) {
				if (!hashVP.children) {
					hashVP.children = []
				}
				hashVP.children.push(data[j])
			} else {  
				json.push(data[j])
			}
		}
		sortAll(json)
		resolve(json)
	})
}

function sortAll(arr) {
	arr.sort((a, b) => a.sort - b.sort)
	for (let i = 0; i < arr.length; i++) {
		if (arr[i].children && arr[i].children.length > 0) {
			sortAll(arr[i].children)
		}
	}
}