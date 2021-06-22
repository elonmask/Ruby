import { createElement } from '../../../../../helpers/createElement'

export class MultiSubHeader {
	constructor() {
		this.node = null
		this.type = 'li'
		this.classes = ['bs-MultipleBets_SubHeader']
	}

	render = () => {
		this.node = createElement({
			type: this.type,
			classes: this.classes,
		})

		this.node.innerHTML = `
				<div class="bs-MultipleBets_SubHeaderContainer">
						<span class="bs-MultipleBets_BettypeHeader">Bet Type</span>
						<span class="bs-MultipleBets_StakeHeader">
							<span class="bs-MultipleBets_StakeHeadertext">Unit Stake</span>
						</span>
						<span class="bs-MultipleBets_EwHeader"></span>
				</div>`

		return this.node
	}
}
