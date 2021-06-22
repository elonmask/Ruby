import { createElement } from '../../../helpers/createElement'

export class TableForTournament {
	constructor({ name }) {
		this.name = name
		this.type = 'div'
		this.node = null
		this.classes = ['flex-container', 'align-center-middle', 'font', 'white']
		this.attributes = [{ name: 'style', value: 'font-size:20px' }]
	}

	render = () => {
		this.div = createElement({
			type: this.type,
			classes: this.classes,
			attributes: this.attributes,
		})

		this.div.innerHTML = `${this.name}`

		return this.div
	}
	update = () => {}
	destroy = () => {}
}
