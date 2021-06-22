import { createElement } from '../../../../../helpers/createElement'
import { findNode, getSession, isRestricted, setSession } from '../../../../../helpers/utils'
import { transformBetName } from '../../../../../helpers/transform/transform'
import { removeStake } from '../../actions/betslipActions'
import { getUserStakes } from '../../../../../selectors/selectors'

// #ust=121212.00#st=121212.00#tr=387878.40#||

export class SingleStake {
	constructor({ fd, od, pt, lm, fi }, placeBetCb, btnChange) {
		this.type = 'li'
		this.classes = [
			'bs-Item',
			'bs-SingleItem',
			// 'suspended',
		]
		this.node = null
		this.toReturnNode = null
		this.oddValueNode = null
		this.inputNode = null

		this.stakeDetails = pt[0]
		this.id = this.stakeDetails.pi
		this.eventId = fi
		this.competitors = fd
		this.oddValue = od
		this.placeBetCb = placeBetCb
		this.btnChange = btnChange
		this.readOnly = false

		this.inputValue = this.getValue()
		this.stakeLimit = null

		if (lm){
			if (Number(lm) < Number(this.inputValue)){
				this.stakeLimit = lm

				const stakesValues = getSession('stakesValues') || {}

				stakesValues[this.id].limit = this.stakeLimit

				setSession('stakesValues', stakesValues)
			}
		}

		if (isRestricted(this.stakeDetails.md, this.id, this.eventId)){
			this.classes.push('bs-RestrictedCong')
		}

	}

	getValue = () => getSession('stakesValues')[this.id]?.stake || 0

	onRemove = () => {
		removeStake(this.stakeDetails.pi)
	}

	writeStakeValueToSession = () => {
		const stakesValues = getSession('stakesValues') || {}

		stakesValues[this.id] = {
			stake: this.inputValue,
			return: (this.inputValue * this.oddValue).toFixed(2),
			limit: this.stakeLimit
		}

		setSession('stakesValues', stakesValues)
	}

	checkValueToLimit =(e)=> {
		if (this.stakeLimit){
			if (this.inputValue < this.stakeLimit){
				e.target.classList.remove('stake_limit-error')
				// this.btnChange(1, null)
			}
		}
	}

	onInput = e => {

		this.inputValue = e.target.value

		this.checkValueToLimit(e)
		this.writeStakeValueToSession()
		console.log(Number(this.inputValue), Number(this.oddValue))
		if  (Number(this.inputValue) * Number(this.oddValue) > 0) {
			document.getElementById("toRet").textContent = ""
			this.toReturnNode.innerHTML = (
				Number(this.inputValue) * Number(this.oddValue)
			).toFixed(2)
		} else {
			this.toReturnNode.innerHTML = ""
			document.getElementById("toRet").textContent = "";
		}
		/*this.toReturnNode.innerHTML = (
			Number(this.inputValue) * Number(this.oddValue)
		).toFixed(2)*/

		this.placeBetCb()
	}

	addListeners = () => {
		this.inputNode.addEventListener('input', this.onInput)
		this.closeBtnNode.addEventListener('click', this.onRemove)
	}

	render = () => {
		// this.readOnly = true

		this.node = createElement({
			type: this.type,
			classes: this.classes,
		})

		const { md: stakeName, bd: currentStake } = this.stakeDetails

		this.node.innerHTML = `
					<div class="bs-SelectionRow">
							<div class="bs-RestrictedBet"></div>
							<div class="bs-RemoveColumn">
								<a class="bs-RemoveColumn_Button remove"></a>
							</div>
							<div class="bs-Selection">
								<div class="bs-Selection_Desc">${transformBetName(currentStake, {
									fd: this.competitors,
									pt: this.stakeDetails,
								})}</div>
								<div class="bs-Selection_Details">${transformBetName(stakeName, {
									fd: this.competitors,
									pt: this.stakeDetails,
								})}</div>
								<div class="bs-Selection_Details">${this.competitors}</div>
							</div>
							<div class="bs-OddsContainer">
								<div class="bs-Odds">${Number(this.oddValue).toFixed(2)}</div>
								<div class="oddsChangeHighlightWrapper">
									<div class="oddsChangeHighlight"></div>
								</div>
							</div>
						</div>
						<div class="bs-ItemOverlay"></div>
						<div class="stake bs-StakeData">
							<div class="bs-StakeAndToReturnContainer">
								<div class="bs-Stake">
									<input
										data-inp-type="sngstk"
										type="text"
										class="stk bs-Stake_TextBox ${this.stakeLimit ? 'stake_limit-error' : ''}"
										value=""
										placeholder="${Number(this.inputValue).toFixed(2)}"
									/>
								</div>
								<div class="bs-StakeToReturn">
									<div id="toRet" class="bs-StakeToReturn_Text"></div>
									<span class="bs-StakeToReturn_Value">
									${
										Number(this.inputValue) > 0 && Number(this.inputValue * this.oddValue) > 0
										? Number(this.inputValue) * Number(this.oddValue)
										: ''
									}
									</span>
								</div>
								<div class="bs-StakeToReturnBreakDownContainer">
									<a
										class="sngbrk bs-StakeToReturnBreakDownLink bs-StakeToReturnBreakDownLink_Hidden"
										>To Return</a
									>
								</div>
							</div>
							<div class="bs-HideBetMax"></div>
						</div>`

		this.oddValueNode = findNode('.', 'bs-Odds', this.node)
		this.toReturnNode = findNode('.', 'bs-StakeToReturn_Value', this.node)
		this.inputNode = findNode('.', 'bs-Stake_TextBox', this.node)
		this.closeBtnNode = findNode('.', 'bs-RemoveColumn_Button', this.node)

		this.addListeners()
		return this.node
	}

	updateValue = value => {
		value = Number(value)

		if (typeof value !== 'number' || this.readOnly) {
			return
		}

		this.inputValue = value
		this.inputNode.value = value.toFixed(2)
		console.log(Number(this.inputValue) * Number(this.oddValue))
		if (Number(this.inputValue) * Number(this.oddValue) > 0) {
			this.toReturnNode.innerHTML = (
				Number(this.inputValue) * Number(this.oddValue)
			).toFixed(2)
		}

		this.writeStakeValueToSession()

		this.placeBetCb(this.inputValue)
	}

	update = () => {
		const userStakes = getUserStakes()

		if (userStakes[this.id]) {
			const odd = userStakes[this.id].split('#')[1]

			const newValue = odd.replace(/[^\d.]/gi, '')

			if (Number(newValue) !== this.oddValue) {
				this.node.classList.add('oddsChange')
				this.oddValueNode.innerHTML = Number(newValue).toFixed(2)
				this.inputNode.setAttribute('readonly', true)
				this.readOnly = true
				this.btnChange(0)
			}
		}
	}

	destroy = () => {}
}
