import { createElement } from '../../../../helpers/createElement'
import { useTranslate } from '../../../../helpers/utils'

export class Empty {
	constructor() {
		this.node = null
		this.type = 'li'
		this.classes = ['bs-EmptyMsg']
	}

	render = () => {
		this.node = createElement({
			type: this.type,
			classes: this.classes,
		})

		this.node.innerHTML = useTranslate("no_stake");

		return this.node
	}
}
