import { createContext, useContext } from 'react'

const ThemeProvider = createContext(null)
ThemeProvider.displayName = 'ThemeProvider'

export default ThemeProvider

export const useTheme = () => {
	return useContext(ThemeProvider)?.theme
}
