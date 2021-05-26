/* eslint-disable no-undef */
const fs = require('fs')
const { ApolloClient, InMemoryCache, gql } = require('@apollo/client')

module.exports = async () => {
	if (fs.existsSync('./src/data/ens.js')) {
		// If the Mirror subdomain wasn't set on the first run, we might have an invalid publication address.
		// This makes sure invalid addresses are re-calculated on every run instead of just the first one.
		if (!String(fs.readFileSync('./src/data/ens.js')).includes("'null'")) return
	}

	const mirrorQL = new ApolloClient({ uri: 'https://mirror-api.com/graphql', cache: new InMemoryCache() })

	const {
		data: { publicationContributors },
	} = await mirrorQL.query({
		query: gql`
			query ContributorAddressQuery($ensDomain: String) {
				publicationContributors(ensLabel: $ensDomain) {
					address
				}
			}
		`,
		variables: { ensDomain: process.env.NEXT_PUBLIC_MIRROR_SUBDOMAIN },
	})

	fs.writeFileSync('./src/data/ens.js', `export const contributorAddresses = ${JSON.stringify(publicationContributors.map(contributor => contributor.address))}\n`)
}
