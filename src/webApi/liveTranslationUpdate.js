import { links } from '../links/links'
import { getRequest } from '../helpers/utils'
import { writeToStorage } from '../storage/storageMethod'

export class LiveTranslationUpdate {

	constructor() {
		this.link = links.matchLiveStreaming
		this.freq = 5000
		this.timerId = null
	}

	loadData = async ()=> {
		try {
			const data = await getRequest(this.link)
			writeToStorage('liveTranslations', data)
		} catch (e){
			console.log(e)
		}
	}

	start =()=> {
		this.timerId = setInterval(this.loadData, this.freq)
	}

	init = async ()=> {
		try {
			await this.loadData()

			this.start()
		} catch (e){
			console.log(e)
		}
	}

	destroy =()=> {
		clearInterval(this.timerId)
	}

}
