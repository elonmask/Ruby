import { createElement } from '../../../../../helpers/createElement'
import { findNode } from '../../../../../helpers/utils'
import { refreshStakes } from '../../actions/betslipRequests'
import { getCurrencySymbol, isLoggedIn } from '../../../../../selectors/configSelectors'
import { AuthError } from '../authError'
import { replaceStakeValueToLimit } from '../../actions/betslipActions'

export class FooterWrapper {
	constructor(placeBetRequest) {
		this.status = 1

		this.type = 'li'
		this.classes = ['bs-Footer']

		this.node = null
		this.totalStakeNode = null
		this._totalStakeValue = null
		// this.storageCallBack = null
		this.message = null
		this.placeBetRequest = placeBetRequest

	}

	get totalStakeValue (){
		return Number(this._totalStakeValue).toFixed(2)
	}

	set totalStakeValue (value){
		if (value){
			this._totalStakeValue = Number(value).toFixed(2)
		}
	}

	placeBet = () => {
		const placeBetHandler = elem => {
			if (isLoggedIn()) {
				if (this.totalStakeValue >= 1) {
					elem.classList.add('disabled')
					this.placeBetRequest()
				}
			} else {
				document.body.append(new AuthError().render())
			}
		}

		const placebet = createElement({
			type: 'a',
			classes: ['bs-BtnWrapper', 'placeBet'],
			listeners: [{ event: 'click', cb: () => placeBetHandler(placebet) }],
		})

		placebet.innerHTML = `<div class="bs-BtnAccept">
														<div class="bs-Btn bs-BtnHover">
															<span class="bs-TotalStake totalStake">
																${getCurrencySymbol()} ${this.totalStakeValue}
															</span>
															<span class="bs-BtnText">Place Bet</span>
														</div> 
                  				</div>`

		this.totalStakeNode = findNode('.', 'totalStake', placebet)

		return placebet
	}


	acceptChanges = () => {

		const acceptChangesHandler = async () => {
			replaceStakeValueToLimit()
			this.status = 1
			this.message = null
			await refreshStakes()
		}

		const accept = createElement({
			type: 'a',
			classes: ['bs-BtnWrapper', 'acceptChanges'],
			listeners: [{ event: 'click', cb:acceptChangesHandler }],
		})

		if (this.message){
			this.messageTemplate()
		}

		accept.innerHTML = `
			<div class="bs-BtnAccept">Accept Changes</div>
		`

		return accept
	}

	messageTemplate =()=> {
		const message = createElement({ type:'li', classes:['bs-MultipleBets_Error'] })

		message.innerHTML = `
			<div class="bs-MultipleBets_RestrictedBet"></div>
			<div class="bs-MultipleBets_RestrictedText">
					${this.message}
			</div>
		`

		this.node.append(message)
	}

	render = (value, { status, message }) => {
		this.totalStakeValue = value || 0
		this.message = message

		this.node = createElement({
			type: this.type,
			classes: this.classes,
		})

		this.node.append(status ? this.placeBet() : this.acceptChanges())

		return this.node
	}

	changeBtn = ({ status, message }) => {

		this.status = status
		this.message = message

		this.node.innerHTML = ''

		if (this.status === 0) {
			this.node.append(this.acceptChanges())
		}

		if (this.status === 1){
			this.node.append(this.placeBet())
		}
	}

	update = data => {
		if (this.status === 1 && this.totalStakeNode) {
			data = Number(data)

			if (data === 0) {
				this.totalStakeValue = 0
				this.totalStakeNode.innerHTML = `${getCurrencySymbol()} ${this.totalStakeValue}`
				return
			}

			if (!data) {
				return
			}

			this.totalStakeValue = data
			this.totalStakeNode.innerHTML = `${getCurrencySymbol()} ${this.totalStakeValue}`
		}
	}
}
