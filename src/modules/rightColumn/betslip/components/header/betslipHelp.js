import { createElement } from '../../../../../helpers/createElement'

export class BetslipHelp {
	constructor() {
		this.node = null
		this.type = 'div'
		this.classes = ['qb-Help_Wrapper-inactive']
	}

	render = () => {
		this.node = createElement({ type: this.type, classes: this.classes })
		this.node.innerHTML = `
						<div class="qb-Help">
							<span class="qb-Help_Text">Help</span>
						</div>`

		return this.node
	}
}
