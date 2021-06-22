import { getInplayEvent } from '../modules/event/actions/eventActions'
import { getEvent } from '../selectors/selectors'

export class EventUpdate {
	constructor() {
		this.timerId = null
	}
	request = async () => {
		try {
			await getInplayEvent(getEvent().id)
		} catch (e) {
			console.log(e)
		}
	}

	init = () => {
		this.timerId = setInterval(this.request, 1000)
	}

	destroy = () => {
		clearInterval(this.timerId)
	}
}
