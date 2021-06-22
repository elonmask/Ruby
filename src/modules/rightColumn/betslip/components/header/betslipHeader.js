import { QbButton } from './qbButton'
import { BetslipType } from './betslipType'
import { BetslipHeaderRemove } from './betslipHeaderRemove'
import { BetslipHelp } from './betslipHelp'
import { createElement } from '../../../../../helpers/createElement'
import { findNode } from '../../../../../helpers/utils'
import { getBetslip } from '../../../../../selectors/selectors'

export class BetslipHeader {
	constructor(clearStorage) {
		this.node = null
		this.type = 'li'
		this.classes = ['bs-Header', 'bs-Header_Hide']
		this.removeAllButton = new BetslipHeaderRemove(clearStorage)
	}

	createHeaderNode = () => {
		this.node = createElement({
			type: this.type,
			classes: this.classes,
		})
	}

	checkIfAddPart = part => {
		if (getBetslip()?.bt) {
			return part
		}
		return ''
	}

	appendHeaderParts = () => {
		// const container = findNode('.', 'bs-ChangeSlipTypeContainer', this.node)
		//
		// const parts = [
		// 	new QbButton().render(),
		// 	this.checkIfAddPart(new BetslipType().render()),
		// 	this.checkIfAddPart(new BetslipHelp().render()),
		// ]
		//
		// parts.forEach(part => container.append(part))

		this.node.append(this.checkIfAddPart(this.removeAllButton.render()))
	}

	render = () => {
		this.createHeaderNode()

		this.node.innerHTML = `
			<div class="bs-ChangeSlipTypeContainer">
					 <div class="bs-ItemOverlay"></div>
			</div>`

		this.appendHeaderParts()

		return this.node
	}
}
