import { BetItem } from './betItem'
import { createElement } from '../../../helpers/createElement'
import { getRequest, isEmpty } from '../../../helpers/utils'
import { links } from '../../../links/links'

export class Unsettled {
 
	emptyTemplate = () => {
		const div = createElement({
			type: 'div',
			classes: ['myBets-body-defaultItem'],
		})

		div.innerHTML = `
			<p>There are no unsettled bets</p>
			<p>Any of your Unsettled bets will appear here</p>
		`

		return div
	}

	load = async () => {
		try {
			return await getRequest(links.unsettled)
		} catch (e) {
			console.log(e)
		}
	}

	render = (data) => {
		return data.map((bet, idx) => new BetItem(bet, idx > 10 ? 'collapse' : null).render())
	}

	init = async () => {
		clearInterval(window.betsInterval)
		window.betsInterval = setInterval( async () => { 
			if (window.location.hash.includes("mybets")) {
				await this.load();
			}
		 }, 2000);
			try {
				const data = await this.load()
				if (!isEmpty(data)) {
					return this.render(data)
				} else {
					return this.emptyTemplate()
				}
			} catch (e) {
				console.log(e)
				return this.emptyTemplate()
			}
		//}, 2000)
	}
}
