import { createElement } from '../../../helpers/createElement'
import { findNode, getRequest } from '../../../helpers/utils'
import { links } from '../../../links/links'

export class UserLinks {
	constructor() {
		this.node = null
		this.type = 'div'
		this.classes = ['user-menu-tabs']
		this.links = [
			{
				href: './#/account',
				title: 'Account history',
				icon: 'fa-money',
			},
			{
				href: './#/account',
				title: 'Account settings',
				icon: 'fa-cogs',
			},
			{
				href: './#/account',
				title: 'Deposit/Withdraw funds',
				icon: 'fa-refresh',
			},
			{
				href: './#/account',
				title: 'Exit',
				icon: 'fa-sign-out',
			},
		]
	}

	linkTemplate = ({ href, title, icon }) => {
		return `
					<a href="${href}" class="user-menu-link flex-container align-middle ${icon
				.split('-')
				.join('')}">
                <p class="fa ${icon}"></p>
                <p class="font">${title}</p>
           </a>`
	}

	appendLinks = () => {
		return this.links.map(link => this.linkTemplate(link)).join('')
	}

	logOut = async e => {
		e.preventDefault()
		try {
			const data = await getRequest(links.logout)
			if (data?.LOGIN?.SUCCESS) {
				window.location.reload()
			}
		} catch (e) {
			console.log(e)
		}
	}

	render = () => {
		this.node = createElement({
			type: this.type,
			classes: this.classes,
		})

		this.node.innerHTML = this.appendLinks()

		findNode('.', 'fasignout', this.node).addEventListener('click', this.logOut)

		return this.node
	}
}
