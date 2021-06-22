import { createElement } from '../../../../../helpers/createElement'
import { removeAll } from '../../actions/betslipActions'

export class BetslipHeaderRemove {
	constructor(clear) {
		this.node = null
		this.type = 'div'
		this.classes = ['bs-Header_RemoveAll']
		this.listeners = [{event:'click', cb:  ()=> {
				removeAll()
				clear()
			}}]
	}

	render = () => {
		this.node = createElement({
			type: this.type,
			classes: this.classes,
			listeners: this.listeners
		})

		this.node.innerHTML = `<a class="bs-Header_RemoveAllLink">Remove All</a>`

		return this.node
	}
}
