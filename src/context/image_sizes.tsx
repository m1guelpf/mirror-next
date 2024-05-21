'use client'

import { createContext, useContext, FC, PropsWithChildren } from 'react'
import { ISizeCalculationResult } from 'image-size/dist/types/interface'

const ImageSizeProvider = createContext<Record<string, ISizeCalculationResult> | null>(null)
ImageSizeProvider.displayName = 'ImageSizeProvider'

export default ImageSizeProvider

export const useImageSizes = (): Record<string, ISizeCalculationResult> => {
	return useContext(ImageSizeProvider)!
}

type Props = PropsWithChildren<{ sizes: Record<string, ISizeCalculationResult> }>
export const SetImageSizes: FC<Props> = ({ children, sizes }) => {
	return <ImageSizeProvider.Provider value={sizes}>{children}</ImageSizeProvider.Provider>
}
