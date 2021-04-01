require('./scripts/resolve-ens')()

module.exports = {
	future: {
		webpack5: true,
	},
	rewrites: async () => [{ source: '/feed.xml', destination: '/api/feed' }],
}
