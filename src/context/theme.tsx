'use client'

import { createContext, useContext, FC, PropsWithChildren } from 'react'

const ThemeProvider = createContext<{ colorMode: 'DARK' | 'LIGHT'; accent: string } | null>(null)
ThemeProvider.displayName = 'ThemeProvider'

export default ThemeProvider

export const useTheme = (): { colorMode: 'DARK' | 'LIGHT'; accent: string } => {
	return useContext(ThemeProvider)!
}

type Props = PropsWithChildren<{ theme: { colorMode: 'DARK' | 'LIGHT'; accent: string } }>
export const SetTheme: FC<Props> = ({ children, theme }) => {
	return <ThemeProvider.Provider value={theme}>{children}</ThemeProvider.Provider>
}
