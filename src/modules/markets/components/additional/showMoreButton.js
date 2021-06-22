import { createElement } from '../../../../helpers/createElement'

export class ShowMoreButton {
	constructor(parentNode) {
		this.node = null
		this.type = 'div'
		this.classes = ['maTable_show_more__container']
		this.listeners = [{ event: 'click', cb: this.onClick }]
		this.parentNode = parentNode
	}
	onClick = () => {
		this.node.innerText =
			this.node.innerText === 'Show more' ? 'Show less' : 'Show more'

		this.parentNode.classList.toggle('maTable__row_show')
		this.parentNode.classList.toggle('maTable__row_hidden')
	}

	render = () => {
		this.node = createElement({
			type: this.type,
			classes: this.classes,
			listeners: this.listeners,
		})

		this.node.innerText = 'Show more'

		return this.node
	}
}
