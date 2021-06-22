import { links } from '../links/links'
import { getRequest } from '../helpers/utils'
import { writeToStorage } from '../storage/storageMethod'

export class ClassificationUpdate {
	constructor() {
		this.link = links.inplayTree
		this.timerId = null
	}

	updateInplay = async () => {
		try {
			const data = await getRequest(this.link)
			writeToStorage('inplay', data)
		} catch (e) {
			console.log('Classification Inplay Error', e)
		}
	}

	setTimer = () => {
		this.timerId = setInterval(() => {
			this.updateInplay()
		}, 2000)
	}

	init = () => {
		this.setTimer()
	}

	destroy = () => {
		clearInterval(this.timerId)
	}
}
