import { BetButton } from './betButton'
import { createElement } from '../../../helpers/createElement'
import { isEqualOutcomes } from '../../../helpers/utils'

export class MarketCell {
	constructor({ odd, specifiers, competitors, specifiersKey, groupId }) {
		this.type = 'div'
		this.classes = ['maTable__cell']
		this.div = null
		this.button = null
		this.odd = odd
		this.specifiers = specifiers
		this.competitors = competitors
		this.specifiersKey = specifiersKey

		this.groupId = groupId
	}

	appendButton = () => {
		this.button = new BetButton({
			odd: this.odd,
			specifiers: this.specifiers,
			competitors: this.competitors,
			specifiersKey: this.specifiersKey,
			groupId: this.groupId,
		})

		this.div.append(this.button.render())
	}

	render = () => {
		this.div = createElement({
			type: this.type,
			classes: this.classes,
		})

		this.appendButton()

		return this.div
	}

	update = odd => {
		if (odd) {
			if (!isEqualOutcomes(this.odd, odd)) {
				this.button.update(odd)
			}
		}
	}

	destroy = () => {
		this.div.remove()
	}
}
