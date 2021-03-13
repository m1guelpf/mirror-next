import client from '../lib/graphql'
import fetchArticles from '../queries/fetch-articles'
import Layout from '../components/Layout'
import Link from 'next/link'
import { format as timeago } from 'timeago.js'
import ReactMarkdown from 'react-markdown'
import { getExcerpt } from '../utils/excerpt'
import { components } from '../utils/markdown'
import { getConfig } from '../hooks/getConfig'

const Index = ({ publication }) => (
	<Layout publication={publication}>
		<div>
			<div className="space-y-32">
				{publication.entries.map(entry => (
					<article key={entry.digest}>
						<Link href={`/${entry.digest}`}>
							<a className="text-gray-900 text-3xl sm:text-5xl font-semibold">{entry.title}</a>
						</Link>
						<div className="flex items-center my-4 space-x-4">
							<img className="rounded-full w-10 h-10" src={entry.contributor.avatarURL} />
							<div className="flex items-center tracking-normal text-gray-800 box-border truncate">
								<div className="flex items-center p-1 leading-5 box-border truncate">
									<p className="mr-2 font-medium box-border truncate">{entry.contributor.displayName}</p>
									<p className="border rounded-full px-1.5 font-medium text-sm text-gray-400 ring-gray-200 hover:ring-4 transition ease-in-out" target="_blank" rel="noreferrer">
										{entry.contributor.address.substr(0, 6)}
									</p>
								</div>
								<time dateTime={new Date(entry.timestamp * 1000)} className="block ml-2 font-medium text-gray-500">
									{timeago(entry.timestamp * 1000)}
								</time>
							</div>
						</div>
						<div className="prose lg:prose-lg mb-8">
							<ReactMarkdown renderers={components}>{getExcerpt(entry.body)}</ReactMarkdown>
						</div>
						{entry.body.split('\n\n').length > 4 && (
							<Link href={`/${entry.digest}`}>
								<a className="bg-blue-100 font-medium text-blue-500 rounded-lg p-4 hover:ring-4 ring-blue-50 transition duration-300 text-base shadow-xs hover:shadow-xs sm:text-lg sm:px-10">Continue Reading</a>
							</Link>
						)}
					</article>
				))}
			</div>
		</div>
	</Layout>
)

export async function getStaticProps() {
	const { ensDomain } = getConfig()

	const {
		data: { publication },
	} = await client.query({ query: fetchArticles, variables: { publication: ensDomain } })

	return {
		props: {
			publication,
		},
	}
}

export default Index
