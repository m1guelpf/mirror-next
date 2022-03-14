import { getPublication } from '@/data/publication'
import Link from 'next/link'

const InternalError = () => (
	<div className="absolute inset-0 flex flex-col space-y-10 items-center justify-center h-full">
		<p className="text-gray-800 text-3xl dark:text-gray-300 font-semibold">Internal Error</p>
		<Link href="/">
			<a className="bg-blue-100 dark:bg-fuchsia-400 dark:bg-opacity-20 font-medium text-blue-500 dark:text-fuchsia-300 rounded-lg px-4 py-3 hover:ring-4 ring-blue-50 dark:ring-fuchsia-400 dark:ring-opacity-20 transition duration-300 text-base shadow-xs hover:shadow-xs sm:text-lg">Return Home</a>
		</Link>
	</div>
)

export async function getStaticProps() {
	const publication = await getPublication()

	return { props: { publication } }
}

export default InternalError
