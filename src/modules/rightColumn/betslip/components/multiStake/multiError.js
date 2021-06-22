import { createElement } from '../../../../../helpers/createElement'

export class MultiError {
	constructor() {
		this.node = null
		this.type = 'li'
		this.classes = ['bs-MultipleBets_Error', 'hidden']
	}

	render = () => {
		this.node = createElement({
			type: this.type,
			classes: this.classes,
		})

		this.node.innerHTML = `
			<div class="bs-MultipleBets_RestrictedBet"></div>
			<div class="bs-MultipleBets_RestrictedText">
					Multiple options are restricted for the highlighted selections
			</div>
		`

		return this.node
	}
}
