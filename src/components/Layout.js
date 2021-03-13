import Link from 'next/link'
import Head from 'next/head'

const Layout = ({ publication, children }) => {
	publication = { ...JSON.parse(publication.publicationSettings.settings), ensLabel: publication.ensLabel }

	return (
		<>
			<Head>
				<title>{publication.displayName} - Mirror</title>
			</Head>
			<div>
				<header className="p-4">
					<Link href="/">
						<a className="flex items-center space-x-4">
							<img className="ring-1 ring-gray-200 rounded-full w-14 h-14 hover:ring-4 transition ease-in-out" src={publication.avatarURL} />
							<div>
								<h1 className="text-xl font-medium">{publication.displayName}</h1>
								<div className="flex items-center space-x-2">
									<span className="rounded-full bg-gray-200 px-1 text-sm text-gray-500 font-medium">ENS</span>
									<p className="text-gray-400 pb-0.5">{publication.ensLabel}.mirror.xyz</p>
								</div>
							</div>
						</a>
					</Link>
				</header>

				<main className="max-w-3xl mx-auto py-16 px-4 sm:px-0">{children}</main>
			</div>
		</>
	)
}

export default Layout
