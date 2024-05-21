import type { Metadata as MetascraperMetadata } from 'metascraper'
import type { ISizeCalculationResult } from 'image-size/dist/types/interface'

export type Metadata = MetascraperMetadata & {
	logo?: { url: string } & ISizeCalculationResult
	image?: { url: string } & ISizeCalculationResult
}
