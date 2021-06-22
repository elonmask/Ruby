import { createElement } from '../../../helpers/createElement'

export class EmptyMessage {
	constructor() {
		this.node = null
		this.type = 'div'
		this.classes = ['flex-container', 'align-center-middle', 'font', 'white']
		this.attributes = [{ name: 'style', value: 'font-size:16px; height:150px' }]
	}

	render = () => {
		this.node = createElement({
			type: this.type,
			classes: this.classes,
			attributes: this.attributes,
		})

		this.node.innerHTML = 'There are no markets available'

		return this.node
	}

	destroy = () => {
		if (this.node) {
			this.node.remove()
		}
	}
}
