import { gql } from '@apollo/client'

export default gql`
	query FetchTransactions($address: String!) {
		transactions(first: 100, tags: [{ name: "App-Name", values: ["MirrorXYZ"] }, { name: "Contributor", values: [$address] }]) {
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
