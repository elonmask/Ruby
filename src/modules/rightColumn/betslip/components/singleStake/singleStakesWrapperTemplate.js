import { createElement } from '../../../../../helpers/createElement'
import { findNode } from '../../../../../helpers/utils'
import { SingleStake } from './singleStake'
import { getBetslip } from '../../../../../selectors/selectors'

export class SingleStakesWrapperTemplate {
	constructor({ placeBetCb, btnChange }) {
		this.node = null
		this.type = 'li'
		this.classes = ['single-section', 'bs-StandardBet']
		this.placeBetCb = placeBetCb
		this.btnChange = btnChange

		this.stakesInstance = {}
	}

	getAllInputsValue = () => {
		return Object.values(this.stakesInstance).reduce((acc, value) => {
			return acc + Number(value.inputValue)
		}, 0)
	}

	renderStakes = () => {
		const data = getBetslip()
		const stakesContainer = findNode('', 'ul', this.node)

		this.stakesInstance = {}

		const { bt } = data

		if (bt) {
			bt.forEach(bet => {
				if (bet) {
					this.stakesInstance[bet.pt[0].pi] = new SingleStake(
						bet,
						this.placeBetCb,
						this.btnChange
					)

					stakesContainer.append(this.stakesInstance[bet.pt[0].pi].render())
				}
			})

			this.placeBetCb(this.getAllInputsValue())

		}
	}

	render = () => {
		this.node = createElement({
			type: this.type,
			classes: this.classes,
		})

		this.node.innerHTML = `<ul></ul>`

		this.renderStakes()

		return this.node
	}

	update = () => {
		Object.values(this.stakesInstance).forEach(instance => {
			instance.update()
		})
	}

	updateSingles = value => {
		Object.values(this.stakesInstance).forEach(instance => {
			instance.updateValue(value)
		})
		// this.getAllInputsValue()
	}

	destroy = () => {
		Object.values(this.stakesInstance).forEach(instance => instance.destroy())
		this.stakesInstance = {}
	}
}
