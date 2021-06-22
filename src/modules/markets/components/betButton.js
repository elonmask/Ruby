import { createElement } from '../../../helpers/createElement'
import { transformOutcomeName } from '../../../helpers/transform/transform'
import { getEvent, getUserStakes } from '../../../selectors/selectors'
import { betButtonHandler } from '../../rightColumn/betslip/actions/betslipActions'
import { writeToBetButtons } from '../../../storage/nodes/betButtonsStorage'
import { isEqualOutcomes } from '../../../helpers/utils'
import { getFromStorage, writeToStorage } from '../../../storage/storageMethod'

export class BetButton {
	constructor({
		odd,
		specifiers,
		competitors,
		specifiersKey,
		onlyValue = false,
		middle = false,
		groupId,
		event = null
	}) {
		this.button = null
		this.type = 'button'
		this.classes = [
			'coef_item',
			'button',
			`${middle ? 'coefficient-title' : 'coefficient'}`,
			`${getFromStorage('userStakes')[odd.id] ? 'on' : 'off'}`
		]
		this.listeners = [{ event: 'click', cb: this.onClick }]
		this.attributes = [{ name: 'data-outcome', value: odd.id }]
		this.event = event || getEvent()
		this.specifiers = specifiers
		this.competitors = competitors
		this.odd = odd
		this.specifiersKey = specifiersKey
		this.onlyValue = onlyValue
		this.groupId = groupId
		this.growth = null
	}

	onClick = e => {
		betButtonHandler({
			event: this.event,
			oddId: this.groupId,
			stakeId: this.odd.id,
			e,
		})
	}

	render = () => {
		this.button = createElement({
			type: this.type,
			classes: this.classes,
			listeners: this.listeners,
			attributes: this.attributes,
		})

		console.log("BET BUTTOn", this.button);

		this.appendHTML()

		writeToBetButtons(this.button)

		return this.button
	}

	appendHTML = () => {
		const { outcome, oddValue, status } = this.odd

		let blick

		if (this.growth) {
			this.growth === 'up' ? (blick = 'down') : (blick = 'up')
		}

		console.log("ODDVALUE: ", oddValue);
		this.button.innerHTML = `
				${
					this.onlyValue
						? ''
						: `<p class="font ellipsis">
									${transformOutcomeName(
										outcome,
										this.specifiers,
										this.competitors,
										this.specifiersKey
									)}
							</p>`
				}
				<p class="font blick ${blick}">${Number(oddValue).toFixed(3)}</p>`
	}

	updateBetslip = async (id, oddValue) => {
		const allStakes = getUserStakes()

		if (allStakes[id]) {
			const splited = allStakes[id].split('#')
			splited[1] = `o=${oddValue}`

			writeToStorage('userStakes', {
				...allStakes,
				[id]: splited.join('#'),
			})

			// await refreshStakes()
		}
	}

	update = odd => {
		if (!isEqualOutcomes(this.odd, odd)) {
			this.updateBetslip(odd.id, odd.oddValue)

			if (this.odd.oddValue > odd.oddValue) {
				this.growth = 'down'
			}

			if (this.odd.oddValue < odd.oddValue) {
				this.growth = 'up'
			}

			if (this.odd.oddValue === odd.oddValue) {
				this.growth = null
			}

			this.odd = odd

			this.appendHTML()
		}
		// if (isEqualOutcomes())
	}

	destroy =()=> {

	}
}
