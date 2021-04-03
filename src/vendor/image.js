import { useIntersection } from 'next/dist/client/use-intersection'
import { toBase64 } from 'next/dist/next-server/lib/to-base-64'

if (typeof window === 'undefined') {
	global.__NEXT_IMAGE_IMPORTED = true
}

const VALID_LOADING_VALUES = ['lazy', 'eager', undefined]

const loaders = new Map([
	['imgix', imgixLoader],
	['cloudinary', cloudinaryLoader],
	['akamai', akamaiLoader],
	['default', defaultLoader],
])

const VALID_LAYOUT_VALUES = ['fixed', 'intrinsic', 'responsive', undefined]

const imageData = process.env.__NEXT_IMAGE_OPTS
const { deviceSizes: configDeviceSizes, imageSizes: configImageSizes, loader: configLoader, path: configPath, domains: configDomains } = imageData
// sort smallest to largest
const allSizes = [...configDeviceSizes, ...configImageSizes]
configDeviceSizes.sort((a, b) => a - b)
allSizes.sort((a, b) => a - b)

let cachedObserver

function getSizes(width, layout) {
	if (typeof width !== 'number' || layout === 'fill' || layout === 'responsive') {
		return { sizes: configDeviceSizes, kind: 'w' }
	}

	const sizes = [...new Set([width, width * 2, width * 3].map(w => allSizes.find(p => p >= w) || allSizes[allSizes.length - 1]))]
	return { sizes, kind: 'x' }
}

function computeSrc(src, unoptimized, layout, width, quality) {
	if (unoptimized) {
		return src
	}
	const { sizes } = getSizes(width, layout)
	const largest = sizes[sizes.length - 1]
	return callLoader({ src, width: largest, quality })
}

function callLoader(loaderProps) {
	const load = loaders.get(configLoader) || defaultLoader
	return load({ root: configPath, ...loaderProps })
}

function generateSrcSet({ src, unoptimized, layout, width, quality }) {
	// At each breakpoint, generate an image url using the loader, such as:
	// ' www.example.com/foo.jpg?w=480 480w, '
	if (unoptimized) {
		return undefined
	}

	const { sizes, kind } = getSizes(width, layout)
	return sizes.map((size, i) => `${callLoader({ src, width: size, quality })} ${kind === 'w' ? size : i + 1}${kind}`).join(', ')
}

function getInt(x) {
	if (typeof x === 'number') {
		return x
	}
	if (typeof x === 'string') {
		return parseInt(x, 10)
	}
	return undefined
}

export default function Image({ src, sizes, unoptimized = false, priority = false, loading, layout, className, quality, width, height, unsized, ...rest }) {
	if (process.env.NODE_ENV !== 'production') {
		if (!src) throw new Error(`Image is missing required "src" property. Make sure you pass "src" in props to the \`next/image\` component. Received: ${JSON.stringify({ width, height, quality, unsized })}`)
		if (!VALID_LAYOUT_VALUES.includes(layout)) throw new Error(`Image with src "${src}" has invalid "layout" property. Provided "${layout}" should be one of ${VALID_LAYOUT_VALUES.map(String).join(',')}.`)
		if (!VALID_LOADING_VALUES.includes(loading)) throw new Error(`Image with src "${src}" has invalid "loading" property. Provided "${loading}" should be one of ${VALID_LOADING_VALUES.map(String).join(',')}.`)
		if (priority && loading === 'lazy') throw new Error(`Image with src "${src}" has both "priority" and "loading=lazy" properties. Only one should be used.`)
	}

	if (!layout) {
		if (sizes) {
			layout = 'responsive'
		} else {
			layout = 'intrinsic'
		}
	}

	let isLazy = !priority && (loading === 'lazy' || typeof loading === 'undefined')

	if (src && src.startsWith('data:')) {
		// https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs
		unoptimized = true
		isLazy = false
	}

	const [setRef, isIntersected] = useIntersection({
		rootMargin: '200px',
		disabled: !isLazy,
	})

	const isVisible = !isLazy || isIntersected

	const widthInt = getInt(width)
	const heightInt = getInt(height)
	const qualityInt = getInt(quality)

	let wrapperStyle
	let sizerStyle
	let sizerSvg
	let imgStyle
	if (typeof widthInt !== 'undefined' && typeof heightInt !== 'undefined' && !unsized) {
		// <Image src="i.png" width="100" height="100" />
		const quotient = heightInt / widthInt
		const paddingTop = isNaN(quotient) ? '100%' : `${quotient * 100}%`
		if (layout === 'responsive') {
			// <Image src="i.png" width="100" height="100" layout="responsive" />
			wrapperStyle = { position: 'relative' }
			sizerStyle = { paddingTop }
		} else if (layout === 'intrinsic') {
			// <Image src="i.png" width="100" height="100" layout="intrinsic" />
			wrapperStyle = {
				display: 'inline-block',
				position: 'relative',
				maxWidth: '100%',
			}
			sizerStyle = {
				maxWidth: '100%',
			}
			sizerSvg = `<svg width="${widthInt}" height="${heightInt}" xmlns="http://www.w3.org/2000/svg" version="1.1"/>`
		} else if (layout === 'fixed') {
			// <Image src="i.png" width="100" height="100" layout="fixed" />
			wrapperStyle = {
				display: 'inline-block',
				position: 'relative',
				width: widthInt,
				height: heightInt,
			}
		}
		imgStyle = {
			height: '100%',
			left: '0',
			position: 'absolute',
			top: '0',
			width: '100%',
		}
	} else if (typeof widthInt === 'undefined' && typeof heightInt === 'undefined' && unsized) {
		// <Image src="i.png" unsized />
		if (process.env.NODE_ENV !== 'production') {
			if (priority) {
				// <Image src="i.png" unsized priority />
				console.warn(`Image with src "${src}" has both "priority" and "unsized" properties. Only one should be used.`)
			}
		}
	} else {
		// <Image src="i.png" />
		if (process.env.NODE_ENV !== 'production') {
			throw new Error(`Image with src "${src}" must use "width" and "height" properties or "unsized" property.`)
		}
	}

	// Generate attribute values
	const imgSrc = computeSrc(src, unoptimized, layout, widthInt, qualityInt)
	const imgSrcSet = generateSrcSet({
		src,
		unoptimized,
		layout,
		width: widthInt,
		quality: qualityInt,
	})

	let imgAttributes = {
		src: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
	}
	if (isVisible) {
		imgAttributes.src = imgSrc
		imgAttributes.srcSet = imgSrcSet
	}

	// No need to add preloads on the client side--by the time the application is hydrated,
	// it's too late for preloads
	return (
		<div style={wrapperStyle}>
			{sizerStyle ? <div style={sizerStyle}>{sizerSvg ? <img style={{ maxWidth: '100%', display: 'block' }} alt="" aria-hidden={true} role="presentation" src={`data:image/svg+xml;base64,${toBase64(sizerSvg)}`} /> : null}</div> : null}
			{!isVisible && (
				<noscript>
					<img {...rest} {...imgAttributes} src={src} decoding="async" sizes={sizes} style={imgStyle} className={className} />
				</noscript>
			)}
			<img {...rest} {...imgAttributes} decoding="async" className={className} sizes={sizes} ref={setRef} style={imgStyle} />
		</div>
	)
}

//BUILT IN LOADERS

function normalizeSrc(src) {
	return src[0] === '/' ? src.slice(1) : src
}

function imgixLoader({ root, src, width, quality }) {
	const params = ['auto=format', 'w=' + width]
	let paramsString = ''
	if (quality) {
		params.push('q=' + quality)
	}

	if (params.length) {
		paramsString = '?' + params.join('&')
	}
	return `${root}${normalizeSrc(src)}${paramsString}`
}

function akamaiLoader({ root, src, width }) {
	return `${root}${normalizeSrc(src)}?imwidth=${width}`
}

function cloudinaryLoader({ root, src, width, quality }) {
	const params = ['f_auto', 'w_' + width]
	let paramsString = ''
	if (quality) {
		params.push('q_' + quality)
	}
	if (params.length) {
		paramsString = params.join(',') + '/'
	}
	return `${root}${paramsString}${normalizeSrc(src)}`
}

function defaultLoader({ root, src, width, quality }) {
	if (process.env.NODE_ENV !== 'production') {
		const missingValues = []

		// these should always be provided but make sure they are
		if (!src) missingValues.push('src')
		if (!width) missingValues.push('width')

		if (missingValues.length > 0) {
			throw new Error(`Next Image Optimization requires ${missingValues.join(', ')} to be provided. Make sure you pass them as props to the \`next/image\` component. Received: ${JSON.stringify({ src, width, quality })}`)
		}

		if (src && !src.startsWith('/') && configDomains) {
			let parsedSrc
			try {
				parsedSrc = new URL(src)
			} catch (err) {
				console.error(err)
				throw new Error(`Failed to parse "${src}" in "next/image", if using relative image it must start with a leading slash "/" or be an absolute URL (http:// or https://)`)
			}

			if (!configDomains.includes(parsedSrc.hostname)) {
				throw new Error(`Invalid src prop (${src}) on \`next/image\`, hostname "${parsedSrc.hostname}" is not configured under images in your \`next.config.js\`\n` + 'See more info: https://nextjs.org/docs/messages/next-image-unconfigured-host')
			}
		}
	}

	return `${root}?url=${encodeURIComponent(src)}&w=${width}&q=${quality || 75}`
}
