import visit from 'unist-util-visit'
import solidity from '../vendor/solidity-lang.json'
const shiki = require('shiki') // needs require

const langs = [...shiki.BUNDLED_LANGUAGES, { id: 'solidity', scopeName: 'source.solidity', grammar: solidity }]

const highlighter = shiki.getHighlighter({ langs, themes: shiki.BUNDLED_THEMES })

module.exports = ({ theme = 'light' }) => async tree => {
	await highlighter.then(highlighter => {
		visit(tree, 'code', node => {
			node.type = 'html'
			node.children = undefined
			node.value = highlighter.codeToHtml(node.value, node.lang, theme === 'dark' ? 'github-dark' : 'github-light').replace('<pre class="shiki"', `<pre class="border dark:border-transparent rounded-lg" language="${node.lang}" meta="${node.meta}"`)
		})
	})
}
