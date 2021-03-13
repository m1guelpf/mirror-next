import { gql } from '@apollo/client'

export default gql`
	query EntryInfo($digest: String!) {
		entry(digest: $digest) {
			digest
			timestamp
			title
			body
			contributor {
				displayName
				avatarURL
				address
			}
			publication {
				ensLabel
				publicationSettings {
					settings
				}
			}
			arweaveTransactionRequest {
				transactionId
			}
		}
	}
`
