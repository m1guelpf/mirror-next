import { format as timeago } from 'timeago.js'
import { mirrorQL } from '@/lib/graphql'
import fetchPublication from '@/queries/mirror/fetch-publication'
import { useRouter } from 'next/router'
import ReactMarkdown from 'react-markdown'
import { components } from '@/utils/markdown'
import { formatAddress } from '@/utils/address'
import unified from 'unified'
import remarkParse from 'remark-parse'
import remarkStringify from 'remark-stringify'
import { getContributor } from '../data/contributor'
import highlightCode from '@/utils/highlightMarkdown'
import { getEntries, getEntry, getEntryPaths } from '@/data/entries'
import { publicationAddress } from '@/data/ens'
import { getConfig } from '@/hooks/getConfig'
import fetchContributor from '@/queries/mirror/fetch-contributor'
import { getPublication } from '@/data/publication'

const Article = ({ publication, entry, contributor }) => {
	const router = useRouter()

	if (router.isFallback) {
		return <div>Loading...</div>
	}

	const { mailingListURL } = JSON.parse(publication?.publicationSettings?.settings || '{ "mailingListURL": null }')

	return (
		<article>
			<header>
				<h1 className="text-gray-900 dark:text-gray-200 text-3xl sm:text-5xl font-bold">{entry.title}</h1>
				<div className="flex items-center my-4 space-x-4">
					<img className="rounded-full w-10 h-10" src={contributor.avatarURL} />
					<div className="flex items-center tracking-normal text-gray-800 dark:text-gray-400">
						<div className="flex items-center p-1 leading-5">
							<p className="mr-2 font-medium">{contributor.displayName}</p>
							<a className="border dark:border-gray-800 rounded-full px-1.5 font-medium text-sm text-gray-400  dark:text-gray-500" href={`https://etherscan.io/address/${entry.contributor}`} target="_blank" rel="noreferrer">
								{entry.contributor.substr(0, 6)}
							</a>
						</div>
						<time dateTime={new Date(entry.timestamp * 1000)} className="block ml-2 font-medium text-gray-500 dark:text-gray-600">
							{timeago(entry.timestamp * 1000)}
						</time>
					</div>
				</div>
			</header>

			<div className="prose lg:prose-lg dark:prose-dark pb-36">
				<ReactMarkdown renderers={components} allowDangerousHtml={true}>
					{entry.body}
				</ReactMarkdown>
			</div>

			{mailingListURL && (
				<div className="flex items-center justify-center mb-10">
					<a href={mailingListURL} target="_blank" rel="noreferrer" className="bg-blue-100 dark:bg-yellow-400 dark:bg-opacity-20 font-medium text-blue-500 dark:text-yellow-300 rounded-lg p-4 hover:ring-4 ring-blue-100 dark:ring-yellow-400 dark:ring-opacity-20 transition duration-300 text-base shadow-xs hover:shadow-xs sm:text-lg sm:px-10 inline-flex items-center space-x-2">
						<svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
						</svg>
						<span>Subscribe</span>
					</a>
				</div>
			)}

			<footer className="border dark:border-gray-800 rounded-lg divide-y dark:divide-gray-800 font-mono max-w-xl mx-auto">
				{entry.transaction && (
					<a href={`https://viewblock.io/arweave/tx/${entry.transaction}`} target="_blank" rel="noreferrer" className="flex items-center justify-between text-gray-400 dark:text-gray-500 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
						<div className="flex items-center">
							<p className="uppercase text-xs mr-1">Arweave TX</p>
							<p className="transform text-xs -rotate-45 font-sans">&rarr;</p>
						</div>
						<p className="text-xs">{formatAddress(entry.transaction)}</p>
					</a>
				)}
				<a href={`https://etherscan.io/address/${entry.contributor}`} target="_blank" rel="noreferrer" className="flex items-center justify-between text-gray-400 dark:text-gray-500 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
					<div className="flex items-center">
						<p className="uppercase text-xs mr-1">Ethereum Address</p>
						<p className="transform text-xs -rotate-45 font-sans">&rarr;</p>
					</div>
					<p className="text-xs">{formatAddress(entry.contributor)}</p>
				</a>
				<div className="flex items-center justify-between text-gray-400 dark:text-gray-500 px-4 py-3">
					<p className="uppercase text-xs">Content Digest</p>
					<p className="text-xs">{formatAddress(entry.digest)}</p>
				</div>
			</footer>
		</article>
	)
}

export async function getStaticPaths() {
	return {
		paths: (await getEntryPaths()).map(path => ({ params: { digest: path.slug } })),
		fallback: true,
	}
}

export async function getStaticProps({ params: { digest } }) {
	try {
		const [publication, contributor, entry] = await Promise.all([getPublication(), getContributor(), getEntry(digest)])
		const darkMode = JSON.parse(publication?.publicationSettings?.settings || '{ "darkMode": false }').darkMode

		const body = await unified()
			.use(remarkParse) // Parse markdown
			.use(highlightCode, { theme: darkMode ? 'dark' : 'light' }) // Highlight code
			.use(remarkStringify) // Serialize markdown
			.process(entry.body)

		return {
			props: {
				publication,
				contributor,
				entry: { ...entry, body: String(body) },
			},
			revalidate: 1 * 60 * 60, // refresh article contents every hour
		}
	} catch {
		return { notFound: true }
	}
}

export default Article
