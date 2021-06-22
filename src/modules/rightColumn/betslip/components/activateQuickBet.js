import { createElement } from '../../../../helpers/createElement'
import { removeAll } from '../actions/betslipActions'

export class ActivateQuickBet {
	constructor(activateQuickBet) {
		this.node = null
		this.type = 'div'
		this.classes = ['activate-qb', 'font']
		this.activateQuickBet = activateQuickBet
		this.listeners = [{ event: 'click', cb: this.popupListener }]
	}

	closePopup = () => {
		document.body.removeChild(this.node)
	}

	clearUserStakes = () => {
		removeAll()
	}

	popupListener = e => {
		const currentClick = e.target

		if (
			currentClick.closest('.close-acQb') ||
			currentClick.closest('#backTo-placeBet')
		) {
			this.closePopup()
			return
		}

		if (currentClick.closest('#actQb-btn')) {
			this.clearUserStakes()
			this.activateQuickBet()
			this.closePopup()
			return
		}
	}

	render = () => {
		this.node = createElement({
			type: this.type,
			classes: this.classes,
			listeners: this.listeners,
		})

		this.node.innerHTML = `
			<div class="activate-qb-inner">
					<span class="fa fa-times close-acQb"></span>
					<h2>Selection On Your Bet Slip</h2>
					<h4>
						Your existing selections will need to be cleared to enable Quick Bet.
					</h4>
					<div class="activate-qb-buttons">
						<button id="actQb-btn">Activate Quick Bet</button>
						<button id="backTo-placeBet">Back to Place Bet</button>
					</div>
			</div>
		`

		return this.node
	}
}
