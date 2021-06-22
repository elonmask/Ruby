import { createElement } from '../../../helpers/createElement'

export class EmptySportCategory{
	constructor() {
		this.type = 'div'
		this.div = null
		this.classes = ['empty-inplay-sport', 'font', 'white']
	}


	create =()=> {
		this.div = createElement({
			type:this.type,
			classes:this.classes
		})

		this.div.innerHTML = 'There are no events available'
	}

	render =(container)=> {
		if (!this.div){
			this.create()
			container.append(this.div)
		}
	}

	destroy =()=> {
		if (!this.div){
			return
		}
		this.div.remove()
	}
}
