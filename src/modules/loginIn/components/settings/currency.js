import { createElement } from '../../../../helpers/createElement'

export class Currency {
	constructor() {
		this.node = null
		this.type = 'div'
		this.classes = ['user-setting-menu-item']

		this.headerNode = null
		this.bodyNode = null
		this.activateBody = false

		this.codes = [
			{
				title: 'EUR',
				id: '1',
			},
			{
				title: 'USD',
				id: '2',
			},
			{
				title: 'UAH',
				id: '3',
			},
		]
	}

	showBody = () => {
		this.activateBody
			? this.bodyNode.remove()
			: this.node.append(this.bodyTemplate())

		this.activateBody = !this.activateBody
	}

	headerTemplate = () => {
		this.headerNode = createElement({
			type: 'div',
			classes: ['user-setting-menu-item-header'],
		})

		this.headerNode.innerHTML = `
					  <div class="user-setting-menu-item-header">
								<h4>Betting curency</h4>
								<p class="current-active-option">USD</p>
								<span class="row"></span>
						</div>`
		this.headerNode.addEventListener('click', this.showBody)
		return this.headerNode
	}

	bodyTemplate = () => {
		this.bodyNode = createElement({
			type: 'div',
			classes: ['user-setting-menu-item-inner'],
		})

		this.bodyNode.innerHTML = `
			${this.codes.map(item => this.itemTemplate(item)).join('')}
		`

		return this.bodyNode
	}

	itemTemplate = ({ title, id }) =>
		` <li class="user-setting-option" 
					data-name="CURRENCY_CODE" 
					data-id="${id}">
					${title}
			</li>`

	render = () => {
		this.node = createElement({
			type: this.type,
			classes: this.classes,
		})
		this.node.append(this.headerTemplate())
		return this.node
	}
}
