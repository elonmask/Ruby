import { createElement } from '../../../../helpers/createElement'
import { findNode } from '../../../../helpers/utils'

export class AuthError {
	constructor() {
		this.node = null
		this.type = 'div'
		this.classes = ['activate-qb', 'font']
		this.listeners = [{ event: 'click', cb: this.destroy }]
	}

	render = () => {
		this.node = createElement({
			type: this.type,
			classes: this.classes,
			listeners: this.listeners,
		})

		this.node.innerHTML = `
			<div class="activate-qb-inner align-spaced flex-container">
					<span class="fa fa-times close-acQb"></span>
					<h4>
						Please log in in the system
					</h4>
					<div class="activate-qb-buttons">
						<button id="backTo-placeBet" class="activate-qb-buttons__close">Close</button>
					</div>
			</div>
		`

		findNode('#', 'backTo-placeBet', this.node).addEventListener(
			'click',
			this.destroy
		)

		return this.node
	}

	destroy = () => {
		this.node.remove()
	}
}
