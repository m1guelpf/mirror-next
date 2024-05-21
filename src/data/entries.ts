import slug from 'slug'
import { cache } from 'react'
import arweave from '@/lib/arweave'
import { arweaveQL } from '@/lib/graphql'
import { contributorAddresses } from './ens'
import { calculateSizes } from '@/utils/images'
import fetchTransactions from '@/queries/arweave/fetch-transactions'
import { ISizeCalculationResult } from 'image-size/dist/types/interface'
import fetchSingleTransaction from '@/queries/arweave/fetch-single-transaction'

export type Entry = {
	title: string
	slug: string
	body: string
	timestamp: number
	digest: string
	contributor: string
	transaction: string
	cover_image: string
	image_sizes: Record<string, ISizeCalculationResult>
}

export const getEntryPaths = async () => {
	const {
		data: {
			transactions: { edges },
		},
	} = await arweaveQL.query({ query: fetchTransactions, variables: { addresses: contributorAddresses } })

	return edges
		.map(({ node }) => {
			const tags = Object.fromEntries(node.tags.map(tag => [tag.name, tag.value]))

			return { slug: tags['Original-Content-Digest'], path: node.id, timestamp: node.block.timestamp }
		})
		.filter(entry => entry.slug && entry.slug !== '')
		.reduce((acc, current) => {
			const x = acc.findIndex(entry => entry.slug === current.slug)
			if (x == -1) return acc.concat([current])
			else {
				acc[x].timestamp = current.timestamp

				return acc
			}
		}, [])
}

const getEntries = async () => {
	const paths = await getEntryPaths()

	return (
		await Promise.all(
			paths.map(async entry =>
				formatEntry(
					JSON.parse(
						(await arweave.transactions.getData(entry.path, { decode: true, string: true })) as string
					),
					entry.slug,
					entry.timestamp
				)
			)
		)
	)
		.sort((a, b) => b.timestamp - a.timestamp)
		.reduce((acc, current) => {
			const x = acc.find(entry => entry.slug === current.slug)
			if (!x) return acc.concat([current])
			else return acc
		}, [])
}

export const getEntry = async (digest: string): Promise<Entry | null> => {
	const {
		data: {
			transactions: { edges },
		},
	} = await arweaveQL.query({ query: fetchSingleTransaction, variables: { digest } })

	if (edges.length === 0) return null

	const {
		0: {
			node: { id: transactionId, block },
		},
	} = edges

	return formatEntry(
		JSON.parse((await arweave.transactions.getData(transactionId, { decode: true, string: true })) as string),
		transactionId,
		block?.timestamp ?? Date.now() / 1000,
		digest
	)
}

const formatEntry = async (entry, transactionId, timestamp, digest?: string): Promise<Entry> => ({
	title: entry.content.title,
	slug: slug(entry.content.title),
	body: entry.content.body,
	timestamp: timestamp,
	digest: digest ?? entry.originalDigest ?? entry.digest,
	contributor: entry.authorship.contributor,
	transaction: transactionId,
	cover_image:
		(entry.content.body.split('\n\n')[0].match(/!\[[^\]]*\]\((.*?)\s*("(?:.*[^"])")?\s*\)/m) || [])?.[1] || null,
	image_sizes: await calculateSizes(entry.content.body),
})

export default cache(getEntries)
