import { gql } from '@apollo/client'

export default gql`
	query PublicationInfo($publication: String!) {
		publication(ensLabel: $publication) {
			ensLabel
			entries {
				digest
				timestamp
				title
				body
				contributor {
					displayName
					avatarURL
					address
				}
			}
			publicationSettings {
				settings
			}
		}
	}
`
