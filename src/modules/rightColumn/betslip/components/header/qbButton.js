import { ActivateQuickBet } from '../activateQuickBet'
import { getQuickBet, getUserStakes } from '../../../../../selectors/selectors'
import { writeToStorage } from '../../../../../storage/storageMethod'
import { createElement } from '../../../../../helpers/createElement'
import { findNode, setSession } from '../../../../../helpers/utils'

export class QbButton {
	constructor() {
		this.node = null
		this.type = 'div'
		this.classes = ['qb-Container']
		this.listeners = [{ event: 'click', cb: this.onClick }]
	}

	toggleQuickBet = () => {
		const switchNode = findNode('.', 'switch-qb', this.node)

		switchNode.classList.toggle('qb-Btn_Switch-false')
		switchNode.classList.toggle('qb-Btn_Switch-true')

		setSession('quickBet', !getQuickBet())
		writeToStorage('quickBet', !getQuickBet())
	}

	warningPopup = () => {
		document.body.append(new ActivateQuickBet(this.toggleQuickBet).render())
	}

	onClick = () => {
		const stakesKey = Object.keys(getUserStakes())

		if (stakesKey.length) {
			this.warningPopup()
		} else {
			this.toggleQuickBet()
		}
	}

	createNode = () => {
		this.node = createElement({
			type: this.type,
			classes: this.classes,
			listeners: this.listeners,
		})
	}

	render = () => {
		this.createNode()

		const gb = getQuickBet()

		this.node.innerHTML = `	<div class="qb-Btn">
															<span class="qb-Btn_Text-quick">Quick Bet</span>
															<span class="switch-qb ${
																gb
																	? 'qb-Btn_Switch-true'
																	: 'qb-Btn_Switch-false'
															}"></span>
														</div>`
		return this.node
	}
}
