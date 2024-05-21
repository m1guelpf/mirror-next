import { FC } from 'react'
import getPublication from '@/data/publication'
import LinkButton from '@/components/LinkButton'

const PageNotFound: FC = async () => {
	const publication = await getPublication()

	return (
		<div className="absolute inset-0 flex flex-col space-y-10 items-center justify-center h-full">
			<p className="text-gray-800 text-3xl dark:text-gray-300 font-semibold">Page Not Found</p>
			<LinkButton href="/" accentColor={publication.theme.accent}>
				Return Home
			</LinkButton>
		</div>
	)
}

export default PageNotFound
