import { visit } from 'unist-util-visit'
import { bundledLanguages, getHighlighter } from 'shiki'

const highlighter = getHighlighter({ langs: Object.keys(bundledLanguages), themes: ['github-dark', 'github-light'] })

export default ({ theme = 'light' }: { theme: 'light' | 'dark' }) =>
	async tree => {
		await highlighter.then(highlighter => {
			visit(tree, 'code', node => {
				node.type = 'html'
				node.children = undefined
				node.value = highlighter
					.codeToHtml(node.value, {
						lang: node.lang,
						theme: theme === 'dark' ? 'github-dark' : 'github-light',
					})
					.replace(
						'<pre class="shiki',
						`<pre language="${node.lang}" meta="${node.meta}" class="border dark:border-transparent rounded-lg`
					)
			})
		})
	}
