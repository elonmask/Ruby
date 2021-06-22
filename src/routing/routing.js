import { HeaderTemplate } from '../modules/header/headerTemplate'
import { FooterTemplate } from '../modules/footer/footerTemplate'
import { getPageTemplate } from '../templates/templatesPages'
import { isLoggedIn } from '../selectors/configSelectors'

export class Routing {
	constructor() {
		this.pagesName = ['live', 'sports', 'search', 'casino']
		this.currentTemplate = ''
		this.mainNode = null
		this.headerNode = null
		this.footerNode = null

	}

	getUrl = () => {
		const page = window.location.hash.split('/')[1]
		const name = this.pagesName.find(item => page === item)

		if (!name) {
			window.location = './#/sports'
			return
		}
		return page
	}

	hideMenu = () => {
		document.getElementById('ev').style.display = 'none'
		document.getElementById('over').style.display = 'none'
	}

	changePage = () => {
		const page = this.getUrl()

		if (!page) {
			return
		}

		this.currentTemplate = getPageTemplate(page)
		this.loadPages()
	}

	loadPages = () => {
		this.mainNode.innerHTML = this.currentTemplate
	}

	getNode = () => (this.mainNode = document.querySelector('.main'))

	getHeaderNode = () => (this.headerNode = document.querySelector('.header'))

	getFooterNode = () => (this.footerNode = document.querySelector('.footer'))

	appendFooterHeader = () => {
		this.getHeaderNode()
		//this.getFooterNode()

		this.headerNode.innerHTML = new HeaderTemplate().render()
		//this.footerNode.innerHTML = new FooterTemplate().render()
	}

	init = async () => {

		if (isLoggedIn()) {
			this.pagesName = [...this.pagesName, 'account', 'mybets']
		}

		this.getNode()
		await this.changePage()
		await this.appendFooterHeader()

		window.addEventListener('hashchange', this.changePage)
	}
}
