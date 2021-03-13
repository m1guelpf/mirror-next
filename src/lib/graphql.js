import { ApolloClient, InMemoryCache } from '@apollo/client'

const client = new ApolloClient({
	uri: 'https://mirror-api.com/graphql',
	cache: new InMemoryCache(),
})

export default client
