import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import { getExcerpt } from '@/utils/excerpt'
import { components } from '@/utils/markdown'
import { format as timeago } from 'timeago.js'
import LinkButton from '@/components/LinkButton'
import { getPublication } from '@/data/publication'
import ImageSizesContext from '@/context/image_sizes'
import { getEntries } from '@/data/entries'

const Index = ({ entries, publication }) => (
	<div className="space-y-32 mb-10">
		{entries.map(entry => (
			<article key={entry.digest}>
				<Link href={`/${entry.transaction}`}>
					<a className="text-gray-900 dark:text-gray-200 text-3xl sm:text-5xl font-bold">{entry.title}</a>
				</Link>
				<div className="flex flex-wrap items-center my-4 gap-x-4 gap-y-2 max-w-xl">
					{publication.members.map(contributor => (
						<div className="flex items-center" key={contributor.address}>
							<img className="rounded-full w-10 h-10" src={contributor.avatarURL} />
							<div className="flex items-center tracking-normal text-gray-800 dark:text-gray-400">
								<div className="flex items-center p-1 leading-5">
									<p className="mr-2 font-medium">{contributor.displayName}</p>
									<a className="bg-gray-100 dark:bg-gray-800 rounded-full px-1.5 font-medium text-sm text-gray-400  dark:text-gray-500" href={`https://etherscan.io/address/${contributor.address}`} target="_blank" rel="noreferrer">
										{contributor.address.substr(0, 6)}
									</a>
								</div>
							</div>
						</div>
					))}
					<div className="flex items-center">
						<time dateTime={new Date(entry.timestamp * 1000)} className="block bg-gray-100 dark:bg-gray-800 rounded-full px-2 py-0.5 font-medium text-sm text-gray-400 dark:text-gray-500">
							{timeago(entry.timestamp * 1000)}
						</time>
					</div>
				</div>
				<div className="prose lg:prose-lg dark:prose-dark mb-8">
					<ImageSizesContext.Provider value={entry.image_sizes}>
						<ReactMarkdown renderers={components} allowDangerousHtml={true}>
							{getExcerpt(entry.body)}
						</ReactMarkdown>
					</ImageSizesContext.Provider>
				</div>
				{entry.body.split('\n\n').length > 4 && <LinkButton href={`/${entry.transaction}`}>Continue Reading</LinkButton>}
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
	const [publication, entries] = await Promise.all([getPublication(), getEntries()])

	return {
		props: {
			publication,
			entries,
		},
		revalidate: 5 * 60, // refresh page index every 5 minutes
	}
}

export default Index
