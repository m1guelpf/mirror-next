import { gql } from '@apollo/client'

export default gql`
	query FetchTransaction($digest: String!) {
		transactions(tags: { name: "Original-Content-Digest", values: [$digest] }) {
			edges {
				node {
					id
				}
			}
		}
	}
`
