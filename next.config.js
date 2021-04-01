module.exports = {
	future: {
		webpack5: true,
	},
	async rewrites() {
		return [
			{
				source: '/feed.xml',
				destination: '/api/feed',
			},
		]
	},
	exportPathMap() {
		const resolveEns = require('./scripts/resolve-ens')

		resolveEns()
	},
}
