import slug from 'slug'
import arweave from '@/lib/arweave'
import { publicationAddress } from './ens'
import { arweaveQL } from '@/lib/graphql'
import fetchSingleTransaction from '@/queries/arweave/fetch-single-transaction'
import fetchTransactions from '@/queries/arweave/fetch-transactions'

export const getEntryPaths = async () => {
	const {
		data: {
			transactions: { edges },
		},
	} = await arweaveQL.query({ query: fetchTransactions, variables: { address: publicationAddress } })

	return edges
		.map(({ node }) => {
			const tags = Object.fromEntries(node.tags.map(tag => [tag.name, tag.value]))

			return { slug: tags['Original-Content-Digest'], path: node.id }
		})
		.filter(entry => entry.slug && entry.slug !== '')
		.reduce((acc, current) => {
			const x = acc.find(entry => entry.slug === current.slug)
			if (!x) return acc.concat([current])
			else return acc
		}, [])
}

export const getEntries = async () => {
	const paths = await getEntryPaths()

	return Promise.all(paths.map(async entry => formatEntry(JSON.parse(await arweave.transactions.getData(entry.path, { decode: true, string: true })), entry.slug)))
}

export const getEntry = async digest => {
	const {
		data: {
			transactions: {
				edges: {
					0: {
						node: { id: transactionId },
					},
				},
			},
		},
	} = await arweaveQL.query({ query: fetchSingleTransaction, variables: { digest } })

	return formatEntry(JSON.parse(await arweave.transactions.getData(transactionId, { decode: true, string: true })), transactionId)
}

const formatEntry = (entry, transactionId) => ({
	title: entry.content.title,
	slug: slug(entry.content.title),
	body: entry.content.body,
	timestamp: entry.content.timestamp,
	digest: entry.originalDigest,
	contributor: entry.authorship.contributor,
	transaction: transactionId,
})
