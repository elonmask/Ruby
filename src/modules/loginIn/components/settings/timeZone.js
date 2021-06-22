import { createElement } from '../../../../helpers/createElement'
import { getTZ } from '../../../../selectors/configSelectors'

export class TimeZone {
	constructor() {
		this.node = null
		this.type = 'div'
		this.classes = ['user-setting-menu-item']

		this.headerNode = null
		this.bodyNode = null
		this.activateBody = false

		this.zones = [
			'UK',
			'ET',
			'PT',
			'CET',
			'CT',
			'MT',
			'GMT-12',
			'GMT-11',
			'GMT-10',
			'GMT-9',
			'GMT-8',
			'GMT-7',
			'GMT-6',
			'GMT-5',
			'GMT-4',
			'GMT-3',
			'GMT-2',
			'GMT-1',
			'GMT',
			'GMT+1',
			'GMT+2',
			'GMT+3',
			'GMT+4',
			'GMT+5',
			'GMT+6',
			'GMT+7',
			'GMT+8',
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
								<h4>Time Zone</h4>
								<p class="current-active-option">${getTZ()}</p>
								<span class="row"></span>
						</div>
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
			${this.zones
				.map((title, idx) => this.itemTemplate({ title, id: idx + 1 }))
				.join('')}
		`

		return this.bodyNode
	}

	itemTemplate = ({ title, id }) =>
		`<li class="user-setting-option" data-name="TZ" data-id="${id}">${title}</li>`

	render = () => {
		this.node = createElement({
			type: this.type,
			classes: this.classes,
		})

		this.node.append(this.headerTemplate())

		return this.node
	}
}
