import { MatchLiveStreamingLogic } from './matchLiveStreaming/matchLiveStreamingLogic'
import { MatchLiveAnimationLogic } from './matchLiveAnimation/matchLiveAnimationLogic'
import { findNode } from '../../../helpers/utils'
import { createElement } from '../../../helpers/createElement'
import { storageEmitter } from '../../../storage/storageEmmiter'
import { getTranslationCurrentTab } from '../../../selectors/selectors'
import { writeToStorage } from '../../../storage/storageMethod'

import '../../../styles/matchLive.css'

export class TranslationLogic{
	constructor() {
		this.links = [
			{
				title:'MATCH LIVE',
				value:'matchLiveAnimation'
			},
			{
				title:'LIVE STREAMING',
				value:'matchLiveStreaming'
			}
		]

		this.active = getTranslationCurrentTab()
		this.linksContainer = null
		this.bodyContainer = null

		this.instances = {
			'matchLiveAnimation': new MatchLiveAnimationLogic(),
			'matchLiveStreaming': new MatchLiveStreamingLogic()
		}
	}

	destroyOldInstance =()=> {
		this.active = getTranslationCurrentTab()

		const unActive = Object.keys(this.instances).filter(key => key !== this.active)
		this.instances[unActive].destroy()
	}

	changeBody =()=> {
		this.active = getTranslationCurrentTab()

		this.destroyOldInstance()
		this.renderContent()
	}

	linkHandler =(active)=> {
		writeToStorage('currentTab', active)
	}

	linkTemplate =({ title, value })=> {

		const link = createElement({
			type:'p',
			classes:['font', 'match-live-title-text', 'translation-link'],
			listeners:[{event:'click', cb:()=> this.linkHandler(value)}]
		})

		if (this.active === value){
			link.classList.add('active')
		}

		link.innerHTML = `<span>${title}</span>`

		return link
	}

	renderLinks =()=> {
		this.linksContainer.innerHTML = ''
		this.links.forEach(link => (
			this.linksContainer.append(this.linkTemplate(link))
		))
	}

	renderBody =()=> {
		this.bodyContainer.innerHTML = ''
		this.bodyContainer.append(this.instances[this.active].init())
	}

	renderContent =()=> {
		this.renderLinks()
		this.renderBody()
	}

	init =()=> {
		this.linksContainer = findNode('.', 'translation-links')
		this.bodyContainer = findNode('.', 'translation-body')

		this.renderContent()

		storageEmitter.writeEventToStorage('currentTab', this.changeBody)
	}

	destroy =()=> {

		Object.values(this.instances).forEach(instance => {
			instance.destroy()
		})

		storageEmitter.removeCallback('currentTab', this.changeBody)
	}

}
