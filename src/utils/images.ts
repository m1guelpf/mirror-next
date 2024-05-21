import sizeOf from 'image-size'
import { ISizeCalculationResult } from 'image-size/dist/types/interface'

export const calculateSizes = async (markdown: string): Promise<Record<string, ISizeCalculationResult>> => {
	return Object.fromEntries(
		await Promise.all(
			[...markdown.matchAll(/!\[[^\]]*\]\((?<url>.*?)\s*("(?:.*[^"])")?\s*\)/gm)].map(async match => [
				match.groups!.url,
				await calculateImageSize(match.groups!.url),
			])
		)
	)
}

export const calculateImageSize = async (url: string): Promise<ISizeCalculationResult> => {
	const image = await fetch(url).then(res => res.arrayBuffer())

	return sizeOf(new Uint8Array(image))
}
