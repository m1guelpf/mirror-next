import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import { getEntries } from '@/data/entries'
import { getExcerpt } from '@/utils/excerpt'
import { components } from '@/utils/markdown'
import { format as timeago } from 'timeago.js'
import LinkButton from '@/components/LinkButton'
import { getPublication } from '@/data/publication'
import { getContributor } from '@/data/contributor'

const Index = ({ entries, contributor }) => (
	<div className="space-y-32 mb-10">
		{entries.map(entry => (
			<article key={entry.digest}>
				<Link href={`/${entry.digest}`}>
					<a className="text-gray-900 dark:text-gray-200 text-3xl sm:text-5xl font-semibold">{entry.title}</a>
				</Link>
				<div className="flex items-center my-4 space-x-4">
					<img className="rounded-full w-10 h-10" src={contributor.avatarURL} />
					<div className="flex items-center tracking-normal text-gray-800 dark:text-gray-400">
						<div className="flex items-center leading-5">
							<p className="mr-2 font-medium">{contributor.displayName}</p>
							<p className="border dark:border-gray-800 rounded-full px-1.5 font-medium text-sm text-gray-400 dark:text-gray-500 ring-gray-200 dark:ring-gray-800 hover:ring-4 transition ease-in-out" target="_blank" rel="noreferrer">
								{entry.contributor.substr(0, 6)}
							</p>
						</div>
						<time dateTime={new Date(entry.timestamp * 1000)} className="block ml-2 font-medium text-gray-500 dark:text-gray-600">
							{timeago(entry.timestamp * 1000)}
						</time>
					</div>
				</div>
				<div className="prose lg:prose-lg dark:prose-dark mb-8">
					<ReactMarkdown renderers={components} allowDangerousHtml={true}>
						{getExcerpt(entry.body)}
					</ReactMarkdown>
				</div>
				{entry.body.split('\n\n').length > 4 && <LinkButton href={`/${entry.digest}`}>Continue Reading</LinkButton>}
			</article>
		))}
		{entries.length === 0 && (
			<div className="absolute inset-0 flex items-center justify-center h-full">
				<p className="text-gray-400 dark:text-gray-600 font-medium">Patience</p>
			</div>
		)}
	</div>
)

export async function getStaticProps() {
	const [publication, contributor, entries] = await Promise.all([getPublication(), getContributor(), getEntries()])

	return {
		props: {
			publication,
			contributor,
			entries,
		},
		revalidate: 5 * 60, // refresh page index every 5 minutes
	}
}

export default Index
