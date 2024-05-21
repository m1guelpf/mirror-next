import '@/styles/style.css'
import Link from 'next/link'
import { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { SetTheme } from '@/context/theme'
import getPublication from '@/data/publication'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })

export async function generateMetadata(): Promise<Metadata> {
	const publication = await getPublication()

	return {
		title: `${publication.displayName} — Mirror`,
		description: publication.description,
		openGraph: {
			title: `${publication.displayName} — Mirror`,
			description: publication.description,
			images: [{ url: publication.avatarURL }],
		},
		twitter: {
			card: 'summary',
			description: publication.description,
			images: [{ url: publication.avatarURL }],
			title: `${publication.displayName} — Mirror`,
		},
		alternates: {
			types: {
				'application/rss+xml': '/feed.xml',
			},
		},
	}
}

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
	const publication = await getPublication()

	return (
		<html lang="en" className={inter.variable}>
			<body className={publication.theme.colorMode == 'DARK' ? 'dark' : ''}>
				<div className="font-sans dark:bg-gray-900 min-h-screen">
					<header className="p-4">
						<Link href="/" className="flex items-center space-x-4">
							<img
								src={publication.avatarURL}
								className="ring-1 ring-gray-200 dark:ring-gray-700 rounded-full w-14 h-14 hover:ring-4 transition ease-in-out"
							/>
							<div>
								<h1 className="text-xl font-medium dark:text-gray-200">{publication.displayName}</h1>
								<div className="flex items-center space-x-2">
									<span className="rounded-full bg-gray-200 dark:bg-gray-800 px-1 text-sm text-gray-500 font-medium">
										ENS
									</span>
									<p className="text-gray-400 dark:text-gray-600 pb-0.5">{publication.ens}</p>
								</div>
							</div>
						</Link>
					</header>
					<main className="max-w-3xl mx-auto py-16 px-4 sm:px-0">
						<SetTheme theme={publication.theme}>{children}</SetTheme>
					</main>
				</div>
			</body>
		</html>
	)
}

export default RootLayout
