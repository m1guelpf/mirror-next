import NProgress from 'nprogress'
import { useRouter } from 'next/router'
import '@/styles/style.css'
import { useEffect } from 'react'
import Layout from '@/components/Layout'

function MyApp({ Component, pageProps }) {
	const router = useRouter()

	NProgress.configure({ showSpinner: false })

	useEffect(() => {
		router.events.on('routeChangeStart', () => NProgress.start())
		router.events.on('routeChangeComplete', () => NProgress.done())
		router.events.on('routeChangeError', () => NProgress.done())

		return () => {
			router.events.off('routeChangeStart', () => NProgress.start())
			router.events.off('routeChangeComplete', () => NProgress.done())
			router.events.off('routeChangeError', () => NProgress.done())
		}
	})

	if (Component.hasLayout === false) return <Component {...pageProps} />

	return (
		<Layout {...pageProps}>
			<Component {...pageProps} />
		</Layout>
	)
}

export default MyApp
