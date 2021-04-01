module.exports = {
	future: {
		webpack5: true,
	},
	exportPathMap() {
		const resolveEns = require('./scripts/resolve-ens')

		resolveEns()
	},
}
