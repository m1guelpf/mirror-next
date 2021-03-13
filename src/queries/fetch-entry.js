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
				displayName
				avatarURL
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
