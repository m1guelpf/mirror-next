import { gql } from '@apollo/client'

export default gql`
	query FetchTransactions($addresses: [String!]!) {
		transactions(first: 100, tags: [{ name: "App-Name", values: ["MirrorXYZ"] }, { name: "Contributor", values: $addresses }]) {
			edges {
				node {
					id
					tags {
						name
						value
					}
				}
			}
		}
	}
`
