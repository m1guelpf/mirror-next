import '../styles/style.css'
import { ApolloProvider } from '@apollo/client'
import client from '../lib/graphql'

function MyApp({ Component, pageProps }) {
	return (
		<ApolloProvider client={client}>
			<Component {...pageProps} />
		</ApolloProvider>
	)
}

export default MyApp
