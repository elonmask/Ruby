import { isLoggedIn } from '../../selectors/configSelectors'
import { useTranslate } from '../../helpers/utils'

export class MenuTemplate {
	constructor() {
		this.links = [
			{
				href: './#/sports/',
				lang: 'sports_lnk',
				text: useTranslate('sports'),
				name: 'sports',
				view: true,
			},
			{
				href: './#/live/overview',
				lang: 'inplay_lnk',
				text: useTranslate('inplay'),
				name: 'live',
				view: true,
			},
			{
				href: './#/mybets/unsettled',
				lang: 'my_bets',
				text: useTranslate('mybets'),
				name: 'mybets',
				view: isLoggedIn(),
			},
			{
				href: './#/casino/',
				lang: '',
				text: useTranslate('casino'),
				name: 'casino',
				view: true,
			}
		]
		this.linksNodes = []
	}

	activeLink = () => {
		this.getCurrentLink()

		if (!this.linksNodes.length) {
			this.linksNodes = document.querySelectorAll('.menu-item')
		}

		this.linksNodes.forEach(a => {
			a.dataset.name === this.currentlink
				? a.classList.add('active')
				: a.classList.remove('active')
		})
	}

	getCurrentLink = () => {
		this.currentlink = window.location.hash.split('/')[1]
	}

	isActive = name => {
		this.getCurrentLink()

		return this.currentlink === name ? 'active' : ''
	}

	render = () => {
		this.init()

		return `<div class="menu flex-container align-center-middle" id="mainHeaderMenu">
        ${this.links
					.map(({ href, lang, text, name, view }) => {
						if (!view) {
							return null
						}

						return `<a 
                        class="font menu-item ${this.isActive(name)}" 
                        href="${href}" 
                        data-lang="${lang}" 
                        data-name="${name}" 
                    >
                        ${text}
                    </a>`
					})
					.join('')}
    </div>`
	}

	init = () => {
		window.addEventListener('hashchange', this.activeLink)
	}
}
