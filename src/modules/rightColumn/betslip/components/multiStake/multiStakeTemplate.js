import { createElement } from '../../../../../helpers/createElement'
import {
	findNode,
	formStringForMulti,
	getSession,
	setSession,
} from '../../../../../helpers/utils'

export class MultiStakeTemplate {
	constructor({ bc, bd, od, bt, lm }, changePlaceBet, changeSinglesValue) {
		this.node = null
		this.type = 'li'
		this.classes = [
			'bs-Item',
			'bs-MultipleBets_BetRows',
			'bs-MultipleBets_StakeRow',
		]

		this.type = bd ? 'Multi' : 'Singles'
		this.stakeName = bd || 'Singles'
		this.oddValue = od && Number(od)
		this.betCount = Number(bc)
		this.changePlaceBet = changePlaceBet
		this.changeSinglesValue = changeSinglesValue
		this.id = bt

		this.viewBetCount = this.oddValue
			? this.oddValue.toFixed(2)
			: this.betCount + 'x'

		this._inputValue = 0
		this.stakeLimit = null
		this.inputNode = null
		this.toReturnNode = null

		if (this.type !== 'Singles'){
			this.valueInStorage()
		}

		if (lm){
			if (Number(lm) < Number(this.inputValue)){
				this.stakeLimit = lm

				const storageMultiStake = getSession('multiStakeValue') || {stake: this.stakeLimit, limit:null}

				storageMultiStake.limit = this.stakeLimit

				setSession('multiStakeValue', storageMultiStake)
			}
		}

	}

	valueInStorage =()=> {
		const { stake } = getSession('multiStakeValue') || {}

		if (stake){
			this.inputValue = stake
		}
	}

	get inputValue(){
		return Number(this._inputValue).toFixed(2)
	}

	set inputValue(value){
		this._inputValue = Number(value).toFixed(2)
	}

	forSinglesStakes = () => {
		this.changeSinglesValue(this.inputValue)
	}

	forMultiStakes = () => {
		this.changePlaceBet(this.inputValue)
		this.toReturnNode.innerHTML = this.getToReturnValue()

		const sessionMultiData = getSession('multiStakes') || {}

		sessionMultiData[this.id] = formStringForMulti({
			st: this.inputValue,
			tr: this.getToReturnValue(),
		})

		setSession('multiStakeValue', {stake:this.inputValue, limit:this.stakeLimit})
		setSession('multiStakes', sessionMultiData)
	}

	inputListener = e => {
		let value = e.target.value

		value = Number(value)

		if (typeof value !== 'number') {
			return
		}

		this.inputValue = value

		if (this.type === 'Multi') {
			this.forMultiStakes()
		} else {
			this.forSinglesStakes()
		}
	}

	getToReturnValue = () => {
		return (this.inputValue * this.oddValue).toFixed(2)
	}

	render = () => {
		this.node = createElement({
			type: this.type,
			classes: this.classes,
		})

		this.node.innerHTML = `
				<div class="bs-MultipleBets_StakeContainer" >
						<div class="bs-MultipleBets_StakeRowLabel">
							<a class="mltbrk bs-MultipleBets_StakeRowLink">${this.stakeName}</a>
						</div>
						<div class="bs-MultipleBets_StakeData">
							<div class="bs-MultipleBets_BetCount">${this.viewBetCount}</div>
							<div class="bs-MultipleBets_Stakeitem">
								<input
									data-inp-type="mltstk"
									data-system="true"
									type="text"
									class="stk bs-MultipleBets_Stake ${this.stakeLimit ? 'stake_limit-error' : '' }"
									value=""
									placeholder="${Number(this.inputValue).toFixed(2)}"
								/>
								<div class="bs-HideBetMaxMultiple"></div>
							</div>
						</div>
						<div class="bs-MultipleBets_EW"></div>
					</div>
					${
						this.type === 'Multi'
							? `
								<div class="bs-MultipleBets_StakeToReturn">
									${
										this.getToReturnValue() > 0
										? 'To Retern'
										: ''
									}
									<span class="multiStake-tr">${
										this.getToReturnValue() > 0
										? this.getToReturnValue()
										: ''
									}</span>
								</div>
								`
							: ''
					}`

		this.inputNode = findNode('.', 'bs-MultipleBets_Stake', this.node)
		this.inputNode.addEventListener('input', this.inputListener)

		this.toReturnNode = findNode('.', 'multiStake-tr', this.node)

		return this.node
	}
}
