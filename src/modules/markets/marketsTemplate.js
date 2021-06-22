import { createElement } from '../../helpers/createElement'

export class MarketsTemplate {
	constructor() {
		this.type = 'marketsTemplate'
		this.type = 'div'
		this.div = null
		this.classes = ['maTable']
		this.id = ['maTable']
	}

	render = () => {
		this.div = createElement({
			type: this.type,
			classes: this.classes,
			id: this.id,
		})

		return this.div
	}
}

