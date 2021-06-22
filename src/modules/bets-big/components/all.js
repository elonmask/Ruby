import { getRequest, isEmpty } from '../../../helpers/utils'
import { links } from '../../../links/links'
import { createElement } from '../../../helpers/createElement'
import { BetItem } from './betItem'

export class All { 
	constructor() {}

	emptyTemplate = () => {
		const div = createElement({
			type: 'div',
			classes: ['myBets-body-defaultItem'],
		})

		div.innerHTML = `
			<p>You have no bets</p>	
			<p>Come back to Edit, Cash Out or find out your most recent bets</p>
		`

		return div
	}

	load = async () => {
		try {
			return await getRequest(links.all)
		} catch (e) {
			console.log(e)
		}
	}

	render = data => {
		return data.map((bet, idx) =>
			new BetItem(bet, idx > 10 ? 'collapse' : null).render()
		)
	}

	init = async () => {
	//	clearInterval(window.betsInterval);
	//	window.betsInterval = setInterval( () => {
		clearInterval(window.betsInterval)
		window.betsInterval = setInterval( async () => { 
			if (window.location.hash.includes("mybets")) {
				await this.load();
			}
		 }, 2000);
		try {
			const data =await this.load()
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
