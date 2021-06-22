import { createElement } from '../../../../helpers/createElement'

export class OddType {
	constructor() {
		this.node = null
		this.type = 'div'
		this.classes = ['user-setting-menu-item']

		this.headerNode = null
		this.bodyNode = null

		this.activateBody = false
		this.types = [
			{
				title: 'Decimal',
				id: '1',
			},
			{
				title: 'Fraction',
				id: '2',
			},
			{
				title: 'American',
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
					<h4>Odds Type</h4>
					<p class="current-active-option">American</p>
					<span class="row"></span>
		`

		this.headerNode.addEventListener('click', this.showBody)

		return this.headerNode
	}

	bodyTemplate = () => {
		this.bodyNode = createElement({
			type: 'div',
			classes: ['user-setting-menu-item-inner'],
		})

		this.bodyNode.innerHTML = `
			${this.types.map(item => this.itemTemplate(item)).join('')}
		`

		return this.bodyNode
	}

	itemTemplate = ({ title, id }) =>
		` <li class="user-setting-option" 
					data-name="ODDS_TYPE" 
					data-id="${id}"
			>
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
