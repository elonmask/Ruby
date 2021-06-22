import { EventUpdate } from '../../webApi/eventUpdate'
import { getRequest } from '../../helpers/utils'
import { links } from '../../links/links'
import { ClassificationUpdate } from '../../webApi/classificationUpdate'
import {
	findNode,
	getBetradarId,
	getRequestWithLoader,
} from '../../helpers/utils'
import {
	getInplayData,
	getInplayEvent,
	getInplayLeague,
} from './actions/eventActions'
import { getModule } from '../../templates/templatesModules'
import { destroyByType } from '../../storage/instances'
import { writeToStorage } from '../../storage/storageMethod'
import { getEvent } from '../../selectors/selectors'
import { FooterTemplate } from '../footer/footerTemplate'

export class EventLogic {
	constructor() {
		this.node = null
		this.eventId = null
		this.eventUpdate = null
		this.classificationUpdate = null
	}

	getEventId = () => {
		this.eventId = window.location.hash.split('/')[5]
	}

	appendClassification = () => {
		this.asideNode.append(getModule('classificationInplay'))
	}

	appendScoreboardMarkets = () => {
		this.node.append(getModule('scoreboard'))
		this.node.append(getModule('markets'))

		const footerContainer = document.createElement('div');
		footerContainer.classList.add("footer");
		footerContainer.style.marginTop = "5px";
		footerContainer.innerHTML = new FooterTemplate().render();

		this.node.append(footerContainer)
	}

	setLiveTranslation = () => {
		const event = getEvent()

		if (event?.externalIds) {
			const id = getBetradarId(event.externalIds)

			id
				? writeToStorage('translation', { animation: id, streaming: id })
				: writeToStorage('translation', { animation: id, streaming: id })
		}
	}

	subscribeToUpdate = () => {
		this.eventUpdate = new EventUpdate()
		this.eventUpdate.init()

		this.classificationUpdate = new ClassificationUpdate()
		this.classificationUpdate.init()
	}

	destroyModules = () => { 
		const modules = ['scoreboardLogic', 'marketsLogic']
		modules.forEach(module => destroyByType(module))

		this.node.innerHTML = ''
	}

	changeEventContent = async () => {
		this.destroyModules()

		try {
			await this.eventUpdate.destroy()

			this.getEventId()
			await getInplayEvent(this.eventId)

			this.setLiveTranslation()
			this.appendScoreboardMarkets()

			await this.eventUpdate.init()
		} catch (e) {
			console.log('Event Logic', e)
		}
	}

	loadEventData = async () => {
		this.getEventId()

		try {
			const { oddtypes } = await getRequest(links.oddTypes);
			await getInplayData()
			await getInplayLeague()
			await getInplayEvent(this.eventId)

			this.setLiveTranslation()

			this.appendClassification()
			this.appendScoreboardMarkets()

			await this.subscribeToUpdate()
		} catch (e) {
			console.log(e)
		}
	}

	init = () => {
		this.node = findNode('#', 'scoreboardWrapper')
		this.asideNode = findNode('#', 'classification_inplay_container')

		getRequestWithLoader(this.loadEventData)()

		window.changeContent = this.changeEventContent
	}

	destroy = () => {
		this.eventUpdate.destroy()
		this.classificationUpdate.destroy()

		writeToStorage('event', null)
		writeToStorage('translation', { animation: null, streaming: null })
	}
}
