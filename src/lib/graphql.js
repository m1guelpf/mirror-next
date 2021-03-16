import { ApolloClient, InMemoryCache } from '@apollo/client'

export const mirrorQL = new ApolloClient({
	uri: 'https://mirror-api.com/graphql',
	cache: new InMemoryCache(),
})

export const arweaveQL = new ApolloClient({
	uri: 'https://arweave.net/graphql',
	cache: new InMemoryCache(),
})
