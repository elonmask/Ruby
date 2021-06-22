import { BetButton } from './betButton'
import { createElement } from '../../../helpers/createElement'
import { transformOutcomeName } from '../../../helpers/transform/transform'
import { isEqualOutcomes } from '../../../helpers/utils'

export class MarketCellTitle {
	constructor({ odd, specifiers, competitors, specifiersKey, groupId }) {
		this.type = 'div'
		this.classes = ['maTable__cell', 'full', 'flex-container']
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
			onlyValue: true,
			middle: true,
			groupId: this.groupId,
		})

		this.div.append(this.button.render())
	}

	render = () => {
		this.div = createElement({
			type: this.type,
			classes: this.classes,
		})

		this.div.innerHTML = `
			<div class="maTable__cell__title">
						<span>${transformOutcomeName(
							this.odd.outcome,
							this.specifiers,
							this.competitors
						)}</span>
			</div>
		`

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

	destroy =()=> {
		this.button.destroy()
		this.div.remove()
	}
}
