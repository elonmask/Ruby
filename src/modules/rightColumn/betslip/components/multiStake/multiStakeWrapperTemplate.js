import { MultiHeader } from './multiHeader'
import { MultiSubHeader } from './multiSubHeader'
import { MultiStakeTemplate } from './multiStakeTemplate'
import { MultiError } from './multiError'
import { createElement } from '../../../../../helpers/createElement'
import { getBetslip } from '../../../../../selectors/selectors'
import { findNode } from '../../../../../helpers/utils'

export class MultiStakeWrapperTemplate {
	constructor({ singleValueChange, placeBetCb }) {
		this.multipleContainer = null

		this.node = null
		this.type = 'li'
		this.classes = ['bs-MultipleBets']

		this.collapsed = true
		this.placeBetCb = placeBetCb
		this.singleValueChange = singleValueChange
		this.stakesInstance = []
	}

	getAllInputsValue = () => {
		return this.stakesInstance.reduce((acc, value) => {
			if (value.type !== 'Singles') {
				acc = acc + Number(value.inputValue)
			}
			return acc
		}, 0)
	}

	collapsedToggle = () => {
		this.collapsed = !this.collapsed
		this.appendParts()
	}

	// appendStakes = () => {}

	// appendError = () => {
	// 	return new MultiError().render()
	// }

	fullMultiWrapper = ({ mo, dm }) => {
		return [
			new MultiHeader(this.collapsedToggle).render(),
			new MultiSubHeader().render(),
			...[...mo, dm].map(stake => {
				const instance = new MultiStakeTemplate(
					stake,
					this.placeBetCb,
					this.singleValueChange
				)

				this.stakesInstance.push(instance)

				return instance.render()
			}),
			new MultiError().render(),
		]
	}

	collapsedMultiWrapper = dm => {
		const instance = new MultiStakeTemplate(
			dm,
			this.placeBetCb,
			this.singleValueChange
		)
		this.stakesInstance.push(instance)

		return [new MultiHeader(this.collapsedToggle).render(), instance.render()]
	}

	appendParts = () => {
		const { dm, mo } = getBetslip()

		this.stakesInstance = []
		this.multipleContainer.innerHTML = ''

		const parts = this.collapsed
			? this.collapsedMultiWrapper(dm)
			: this.fullMultiWrapper({ mo, dm })

		parts.forEach(part => {
			this.multipleContainer.append(part)
		})
	}

	render = () => {
		if (!getBetslip().mo) {
			return ''
		}
		this.node = createElement({
			type: this.type,
			classes: this.classes,
		})

		this.node.innerHTML = `
				<div class="bs-ItemOverlay"></div>
				<ul class="closed" id="bsMultipleContainer"></ul>`

		this.multipleContainer = findNode('#', 'bsMultipleContainer', this.node)

		this.appendParts()

		return this.node
	}

	update = () => {
		// const data = getBetslip()
	}
}
