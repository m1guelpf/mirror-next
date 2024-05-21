import Link from 'next/link'
import getEntries from '@/data/entries'
import { getExcerpt } from '@/utils/excerpt'
import { format as timeago } from 'timeago.js'
import getPublication from '@/data/publication'
import LinkButton from '@/components/LinkButton'
import { SetImageSizes } from '@/context/image_sizes'
import ReactMarkdown, { Components } from 'react-markdown'
import { BlockQuote, LinkOrEmbed, Block, Image } from '@/utils/markdown'

export const revalidate = 5 * 60 // refresh page index every 5 minutes

const components: Components = {
	img: Image,
	a: LinkOrEmbed,
	blockquote: BlockQuote,
	p: Block,
}

const Index = async () => {
	const [publication, entries] = await Promise.all([getPublication(), getEntries()])

	return (
		<div className="space-y-32 mb-10">
			{entries.map(entry => (
				<article key={entry.digest}>
					<Link
						href={`/${entry.transaction}`}
						className="text-gray-900 dark:text-gray-200 text-3xl sm:text-5xl font-bold"
					>
						{entry.title}
					</Link>
					<div className="flex flex-wrap items-center my-4 gap-x-4 gap-y-2 max-w-xl">
						{publication.members.map(contributor => (
							<div className="flex items-center" key={contributor.address}>
								<img className="rounded-full w-10 h-10" src={contributor.avatarURL} />
								<div className="flex items-center tracking-normal text-gray-800 dark:text-gray-400">
									<div className="flex items-center p-1 leading-5">
										<p className="mr-2 font-medium">{contributor.displayName}</p>
										<a
											className="bg-gray-100 dark:bg-gray-800 rounded-full px-1.5 font-medium text-sm text-gray-400  dark:text-gray-500"
											href={`https://etherscan.io/address/${contributor.address}`}
											target="_blank"
											rel="noreferrer"
										>
											{contributor.address.substr(0, 6)}
										</a>
									</div>
								</div>
							</div>
						))}
						<div className="flex items-center">
							<time
								dateTime={new Date(entry.timestamp * 1000).toISOString()}
								className="block bg-gray-100 dark:bg-gray-800 rounded-full px-2 py-0.5 font-medium text-sm text-gray-400 dark:text-gray-500"
							>
								{timeago(entry.timestamp * 1000)}
							</time>
						</div>
					</div>
					<div className="prose lg:prose-lg dark:prose-dark mb-8">
						<SetImageSizes sizes={entry.image_sizes}>
							<ReactMarkdown components={components}>{getExcerpt(entry.body)}</ReactMarkdown>
						</SetImageSizes>
					</div>
					{entry.body.split('\n\n').length > 4 && (
						<LinkButton href={`/${entry.transaction}`} accentColor={publication.theme.accent}>
							Continue Reading
						</LinkButton>
					)}
				</article>
			))}
			{entries.length === 0 && (
				<div className="absolute inset-0 flex items-center justify-center h-full">
					<p className="text-gray-400 dark:text-gray-600 font-medium">Patience</p>
				</div>
			)}
		</div>
	)
}

export default Index
