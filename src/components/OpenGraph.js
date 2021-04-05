import useSWR from 'swr'
import axios from 'axios'
import EntryLink from './EntryLink'
import { LinkIcon } from '@heroicons/react/solid'

const OpenGraph = ({ url, children }) => {
	const { data, error } = useSWR(`/api/link-preview?url=${url}`, url => axios.get(url).then(res => res.data))
	const isLoading = !data && !error

	if (error) return <EntryLink href={url}>{children}</EntryLink>

	return (
		<figure className={`rounded-lg max-w-lg mx-auto shadow-card bg-white dark:bg-gray-800 opengraph overflow-hidden ${isLoading ? '' : 'hover:ring-4 transition duration-300 ring-gray-300 dark:ring-gray-700'}`}>
			{isLoading ? (
				<div className="py-16 px-8 flex items-center justify-center">
					<svg className="w-6 h-6 animate-spin text-black dark:text-white text-opacity-40" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
						<circle fill="none" strokeWidth="2" strokeLinecap="round" strokeDasharray="32" cx="12" cy="12" r="10"></circle>
						<circle fill="none" strokeWidth="2" strokeLinecap="round" cx="12" cy="12" r="10" opacity="0.25"></circle>
					</svg>
				</div>
			) : (
				<EntryLink className="block" href={url}>
					<div>
						<div className="pb-[50%] relative border-b dark:border-gray-700">
							<img className="object-cover absolute inset-0 h-full w-full" src={data.image.url} alt={data.title} />
						</div>
						<div className="py-5 px-5">
							<p className="text-gray-800 dark:text-gray-200 font-medium break-words text-base">{data.title}</p>
							<p className="text-gray-400 dark:text-gray-500 text-base !mt-1">{data.description}</p>
							<div className="flex items-center space-x-2 !mt-3">
								<LinkIcon className="w-4 h-4 text-gray-400 dark:text-gray-600" />
								<p className="text-gray-500 dark:text-gray-600 text-base">{new URL(data.url).hostname}</p>
							</div>
						</div>
					</div>
				</EntryLink>
			)}
		</figure>
	)
}

export default OpenGraph
