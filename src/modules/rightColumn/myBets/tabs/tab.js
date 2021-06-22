import { createElement } from '../../../../helpers/createElement'

export class Tab {
	constructor(title, attr, listeners, classes) {
		this.title = title
		this.type = 'a'
		this.attr = attr
		this.listeners = listeners
		this.classes = classes
		this.a = null
	}

	render = () => {
		this.a = createElement({
			type: this.type,
			attributes: this.attr,
			listeners: this.listeners,
			classes: this.classes,
		})

		this.a.innerHTML = this.title

		return this.a
	}
}
