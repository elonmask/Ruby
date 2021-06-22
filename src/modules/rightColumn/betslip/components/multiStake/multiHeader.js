import { createElement } from '../../../../../helpers/createElement'

export class MultiHeader {
	constructor(cb) {
		this.node = null
		this.type = 'li'
		this.classes = ['bs-MultipleBets_Header']
		this.listeners = [{ event: 'click', cb }]
	}

	render = () => {
		this.node = createElement({
			type: this.type,
			classes: this.classes,
			listeners: this.listeners,
		})

		this.node.innerHTML = `
			<a
						class="mlthd bs-MbHeader_Link open"
						id="mlthdr"
						data-stext="Show all multiples"
						data-htext="Hide all multiples"
					>
						Show all multiples
					</a>
		`
		return this.node
	}
}
