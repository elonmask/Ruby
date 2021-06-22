import { createElement } from '../../../helpers/createElement'
import { getCurrencySymbol } from '../../../selectors/configSelectors'
import { findAllNodes, findNode } from '../../../helpers/utils'
import { transformOutcomeName } from '../../../helpers/transform/transform'

export class BetItem {
	constructor({ NA, AM, RE, PA }, classes) {
		this.type = 'div'
		this.node = null
		this.classes = ['myBets-item']
		this.listeners = [{ event: 'click', cb: this.collapseToggle }]
		this.name = NA
		this.stakeValue = AM
		this.toReturn = RE
		this.stakes = PA || []
		this.collapsed = !!classes

		if (classes) {
			this.classes.push(classes)
		}
	}

	renderStakes = () => {
		const mainTitle =(name)=> name.replace(/X/gi, 'Draw ')

		return this.stakes
			.map(
				({ NA, MA, OD, CL, SL }) =>
					`<div class="myBets-item-body__stake">
							 <div class="myBets-item-body-left">
										<div class="item-betResult-desk">${mainTitle(SL)}</div>
										<div class="item-betKind desk">${MA}</div>
										<div class="item-betInfo desk">
												<span class="item-betInfo-commands ">${NA}</span>
							<!--									<span class="item-betInfo-result">0-1</span>-->
							<!--									<span class="item-betInfo-time">23:20</span>-->
										</div>
								</div>
								<div class="myBets-item-body-right">
										<span class="item-bet-koef-desk">${OD}</span>
								</div>
							</div>`
			)
			.join('')
	}

	appendHTML = () => {
		return `<div class="myBets-item-header desktop_font" >
                    <div class="myBets-item-header-left">
                        <span>${getCurrencySymbol()} ${this.stakeValue}</span>
                        <span>${this.name}</span>
                    </div>
                    <div class="myBets-item-header-right">
<!--                        <button class="edit-bet desktop_font_btn">Edit Bet</button>-->
												<button class="collapse__toggle fa 
														${this.collapsed ? 'fa-angle-down' : 'fa-angle-up'}">
												</button>
                    </div>
                </div>
                <div class="myBets-item-body">${this.renderStakes()}</div>
                <div class="myBets-item-footer">
                    <div class="item-stake">
                    			To Stake 
                    	<br> 
													${getCurrencySymbol()} 
													${this.stakeValue}
										</div>
                    <div class="item-toReturn">
                    			To Return 
                    	<br> 
												${getCurrencySymbol()} 
												${this.toReturn}
										</div>
                </div>`
	}

	collapseToggle = e => {
		const current = e.currentTarget
		const collapsedButton = findNode('.', 'collapse__toggle', current)

		const target = e.target

		if (target.closest('.collapse__toggle') === collapsedButton) {
			current.classList.toggle('collapse')
			collapsedButton.classList.toggle('fa-angle-up')
			collapsedButton.classList.toggle('fa-angle-down')
		}
	}

	render = () => {
		this.node = createElement({
			type: this.type,
			classes: this.classes,
			listeners: this.listeners,
		})

		this.node.innerHTML = this.appendHTML()

		return this.node
	}
}
