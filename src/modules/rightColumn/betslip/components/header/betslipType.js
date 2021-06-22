import { createElement } from '../../../../../helpers/createElement'

export class BetslipType {
	constructor() {
		this.node = null
		this.type = 'div'
		this.classes = ['bs-BetSlipType', 'qb-BetSlipType', 'show']
	}

	createNode = () => {
		this.node = createElement({ type: this.type, classes: this.classes })
	}

	dropDownRender = () =>
		`<div
							id="betSlipTypeOptions"
							class="bs-BetSlipType_Options bs-Dropdown">
							<ul class="bs-Dropdown_Items">
								<li class="bs-Dropdown_Item selected">
									<div class="bs-Dropdown_ItemText" data-item="1">
										Standard
									</div>
								</li>
								<li class="bs-Dropdown_Item">
									<div class="bs-Dropdown_ItemText" data-item="2">
										Banker
									</div>
								</li>
							</ul>
						</div>`

	render = () => {
		this.createNode()
		this.node.innerHTML = `
						<div id="betSlipTypeSelection" class="bs-BetSlipType_Selection">
							<div	id="betSlipTypeSelectionText"
								class="bs-BetSlipType_SelectionText">
								Standart
							</div>
						</div>
						${this.dropDownRender()}
			`

		return this.node
	}
}

// <select class="bet-slip-type">
// 	<option selected="selected" value="1">
// 	Standard
// 	</option>
// 	<option value="2">Banker</option>
// 	</select>
