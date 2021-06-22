import { createElement } from '../../../helpers/createElement'
import { findNode } from '../../../helpers/utils'

let instance = null

export class QuickbetPopup {
	constructor(x = 0, y = 0) {
		this.x = x + 'px'
		this.y = y + 'px'

		if (instance) {
			instance.destroyInstance()
		}

		this.node = null
		this.type = 'div'
		this.classes = ['qb-Cupon']

		instance = this
	}

	destroyInstance = () => {
		document.body.removeChild(this.node)
		instance = null
	}

	appendHTML = () =>
		this.node.innerHTML = `<div class="qb-QuickBetMessageHeader hide">
                <div class="qb-QuickBetMessageHeader_Message "></div>
                <div class="qb-QuickBetMessageHeader_Close "></div>
            </div>
            <div class="qb-QuickBetSelection ">
                <div class="qb-QuickBetSelection_Close fa fa-times "></div>
                <div class="qb-QuickBetSelection_Row ">
                    <div class="qb-QuickBetSelection_Selection ">Draw</div>
                    <div class="qb-QuickBetSelection_Handicap qb-QuickBetSelection_Handicap-empty "></div>
                    <div class="qb-QuickBetSelection_OddsAt ">@</div>
                    <div class="qb-QuickBetSelection_Oddscontainer ">
                        <div class="qb-QuickBetSelection_Odds ">9.00</div>
                    </div>
                </div>
                <div class="qb-QuickBetSelection_BetTypeContainer ">
                    <div class="qb-QuickBetSelection_BetType ">Fulltime Result</div>
                </div>
                <div class="qb-QuickBetSelection_Fixture ">AR Guelma Women v CF Akbou Women</div>
            </div>
            <div class="qb-QuickBetUseBetCredits hide ">
                <div class="qb-QuickBetUseBetCredits_CheckBoxWrapper ">
                    <div class="qb-QuickBetUseBetCredits_CheckBox "></div>
                </div>
                <div class="qb-QuickBetUseBetCredits_TextWrapper ">
                    <div class="qb-QuickBetUseBetCredits_Text "></div>
                </div>
            </div>
            <div class="qb-QuickBetStake ">
                <div class="qb-QuickBetStake_BumperLine ">
                    <div class="qb-QuickBetStake_StakeLine ">
                        <div class="qb-QuickBetStake_Button ">-</div>
                        <input type="text" class="qb-QuickBetStake_InputField ">
                        <div class="qb-QuickBetStake_Button ">+</div>
                    </div>
                    <div class="qb-QuickBetStake_Bumpers ">
                        <div class="qb-QuickBetStake_BumperButton ">+5</div>
                        <div class="qb-QuickBetStake_BumperButton ">+10</div>
                        <div class="qb-QuickBetStake_BumperButton ">+50</div>
                    </div>
                </div>
            </div>
            <div class="qb-QuickBetBetCreditsMessage hide ">
                <div class="qb-QuickBetBetCreditsMessage_Container ">
                    <div class="qb-QuickBetBetCreditsMessage_CreditMessage "></div>
                </div>
                <div class="qb-QuickBetBetCreditsMessage_ReturnsMessage "></div>
            </div>
            <div class="qb-QuickBetFooter ">
                <div class="qb-QuickBetFooter_Button ">
                    <div class="qb-QuickBetFooter_PlaceButtonContent ">
                        <div class="qb-QuickBetFooter_Stake ">$80.00</div>
                        <div class="qb-QuickBetFooter_PlaceText ">Place Bet</div>
                        <div class="qb-QuickBetFooter_ToReturnWrapper ">
                            <span class="qb-QuickBetFooter_ToReturnLabel ">To Return</span>
                            <span class="qb-QuickBetFooter_NetReturnLabel hide ">Net Return</span>
                            <span class="qb-QuickBetFooter_ToReturnAmount ">720.00</span>
                        </div>
                    </div>
                    <div class="qb-QuickBetFooter_AcceptButtonContent hide ">
                        <div class="qb-QuickBetFooter_AcceptText ">Accept &amp; Place Bet</div>
                    </div>
                    <div class="qb-QuickBetFooter_PlacingButtonContent hide ">
                        <div class="qb-QuickBetFooter_PlacingText ">Processing</div>
                    </div>
                </div>
            </div>`

	render = () => {
		this.node = createElement({
			type: this.type,
			classes: this.classes,
			style: { top: this.y, left: this.x },
		})

		this.appendHTML()

		const closeIcon = findNode('.', 'qb-QuickBetSelection_Close', this.node)

		closeIcon.addEventListener('click', this.destroyInstance)

		return this.node
	}
}
