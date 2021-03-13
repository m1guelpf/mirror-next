import { format as timeago } from 'timeago.js'
import Layout from '../components/Layout'
import client from '../lib/graphql'
import fetchEntry from '../queries/fetch-entry'
import { useRouter } from 'next/router'
import ReactMarkdown from 'react-markdown'
import { components } from '../utils/markdown'
import { formatAddress } from '../utils/address'
import fetchArticles from '../queries/fetch-articles'
import { getConfig } from '../hooks/getConfig'

const Article = ({ entry }) => {
	const router = useRouter()

	if (router.isFallback) {
		return <div>Loading...</div>
	}

	return (
		<Layout publication={entry.publication}>
			<article>
				<header>
					<h1 className="text-gray-900 text-3xl sm:text-5xl font-bold">{entry.title}</h1>
					<div className="flex items-center my-4 space-x-4">
						<img className="rounded-full w-10 h-10" src={entry.contributor.avatarURL} />
						<div className="flex items-center tracking-normal text-gray-800 box-border truncate">
							<div className="flex items-center p-1 leading-5 box-border truncate">
								<p className="mr-2 font-medium box-border truncate">{entry.contributor.displayName}</p>
								<a className="border rounded-full px-1.5 font-medium text-sm text-gray-400" href={`https://etherscan.io/address/${entry.contributor.address}`} target="_blank" rel="noreferrer">
									{entry.contributor.address.substr(0, 6)}
								</a>
							</div>
							<time dateTime={new Date(entry.timestamp * 1000)} className="block ml-2 font-medium text-gray-500">
								{timeago(entry.timestamp * 1000)}
							</time>
						</div>
					</div>
				</header>

				<div className="prose lg:prose-lg pb-36">
					<ReactMarkdown renderers={components}>{entry.body}</ReactMarkdown>
				</div>

				<footer className="border rounded-lg divide-y font-mono max-w-xl mx-auto">
					<a href={`https://viewblock.io/arweave/tx/${entry.arweaveTransactionRequest.transactionId}`} className="flex items-center justify-between text-gray-400 px-4 py-3 hover:bg-gray-50 transition">
						<div className="flex items-center">
							<p className="uppercase text-xs mr-1">Arweave TX</p>
							<p className="transform text-xs -rotate-45 font-sans">&rarr;</p>
						</div>
						<p className="text-xs">{formatAddress(entry.arweaveTransactionRequest.transactionId)}</p>
					</a>
					<a href={`https://etherscan.io/address/${entry.contributor.address}`} className="flex items-center justify-between text-gray-400 px-4 py-3 hover:bg-gray-50 transition">
						<div className="flex items-center">
							<p className="uppercase text-xs mr-1">Ethereum Address</p>
							<p className="transform text-xs -rotate-45 font-sans">&rarr;</p>
						</div>
						<p className="text-xs">{formatAddress(entry.contributor.address)}</p>
					</a>
					<div className="flex items-center justify-between text-gray-400 px-4 py-3">
						<p className="uppercase text-xs">Content Digest</p>
						<p className="text-xs">{formatAddress(entry.digest)}</p>
					</div>
				</footer>
			</article>
		</Layout>
	)
}

export async function getStaticPaths() {
	const { ensDomain } = getConfig()

	const {
		data: {
			publication: { entries },
		},
	} = await client.query({ query: fetchArticles, variables: { publication: ensDomain } })

	return {
		paths: entries.map(entry => ({ params: { digest: entry.digest } })),
		fallback: true,
	}
}

export async function getStaticProps({ params: { digest } }) {
	const {
		data: { entry },
	} = await client.query({ query: fetchEntry, variables: { digest } })

	return {
		props: { entry },
	}
}

export default Article
