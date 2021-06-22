import { createElement } from '../../../../helpers/createElement'
import { getTZ } from '../../../../selectors/configSelectors'

export class InactivityTime {
	constructor() {
		this.node = null
		this.type = 'div'
		this.classes = ['user-setting-menu-item']

		this.headerNode = null
		this.bodyNode = null
		this.activateBody = false

		this.times = [
			{
				title: '1 hour',
				id: '1',
			},
			{
				title: '2 hour',
				id: '2',
			},
			{
				title: '3 hour',
				id: '3',
			},
			{
				title: '4 hour',
				id: '4',
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
								<h4>Max Inactivity Time</h4>
								<p class="current-active-option">2 hour</p>
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
			${this.times.map(item => this.itemTemplate(item)).join('')}
		`

		return this.bodyNode
	}

	itemTemplate = ({ title, id }) =>
		`<li class="user-setting-option" 
				  data-name="INACTIVITY_TIMEOUT" 
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
