import { MarketBody } from './marketBody'
import { transformOutcomeName } from '../../../helpers/transform/transform'
import { createElement } from '../../../helpers/createElement'

export class MarketsWrapper {
	constructor({ name: oddName, outcomes, id }, competitors, name) {
		this.div = null
		this.type = 'div'
		this.classes = ['maTable__row']
		this.id = id
		this.name = oddName
		this.outcomes = outcomes
		this.specifiers = outcomes[0].specifiers
		this.competitors = competitors
		this.tournamentName = name
		this.bodyInstance = null
	}

	renderMarkets = () => {
		this.bodyInstance = new MarketBody(
			this.outcomes,
			this.id,
			this.competitors
		).init()

		this.div.append(this.bodyInstance.render())
	}

	render = () => {
		this.div = createElement({
			type: this.type,
			classes: this.classes,
		})

		this.div.innerHTML = `
					<div class="maTable__cell full">
             <div class="flex-container align-middle maInfo">
<!--               <span class="star maInfo__icon"></span>-->
               <span class="font white ellipsis maInfo__text">
										${transformOutcomeName(this.name, this.specifiers, this.competitors || this.tournamentName)}</span>
               <hr class="maInfo__separate" />
<!--               <a class="maInfo__inform"></a>-->
             </div>
           </div>`

		this.renderMarkets()
		return this.div
	}

	update = data => {
		if (this.bodyInstance) {
			this.bodyInstance.update(data)
		}
	}

	destroy = () => {
		this.bodyInstance = null

		this.div.classList.add('destroy')
		setTimeout(() => {
			this.div.remove()
		}, 400)
	}
}

// if (overUnder.includes(odd.id)) {
// 	this.node.append(new OverUnder(odd, this.competitors).render())
// 	return
// }
