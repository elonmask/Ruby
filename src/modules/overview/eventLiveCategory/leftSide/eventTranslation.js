import { createElement } from '../../../../helpers/createElement'
import { writeToStorage } from '../../../../storage/storageMethod'
import { getLiveStreamingData, getTranslationCurrentTab, getTranslationIds } from '../../../../selectors/selectors'
import { getBetradarId } from '../../../../helpers/utils'
import { storageEmitter } from '../../../../storage/storageEmmiter'

import streamBase from '../../../../img/icon-sport/MLVideoBW.svg'
import animationBase from '../../../../img/icon-sport/ML1BW.svg'
import streamActive from '../../../../img/icon-sport/MLVideo.svg'
import animationActive from '../../../../img/icon-sport/ML1.svg'

export class EventTranslation {
	constructor(enrichment, externalIds) {

		this.node = null
		this.enrichment = enrichment
		this.externalIds = externalIds
		this.betradarId = getBetradarId(externalIds)

		this.translation = {
			animation:null,
			streaming:null
		}

		this.lightIcon = this.lightIcon.bind(this)


	}

	lightIcon(){
		const { animation, streaming } = getTranslationIds()
		const current = getTranslationCurrentTab()

		if (this.translation.animation){

			const image = this.betradarId === animation && current === 'matchLiveAnimation' ? animationActive : animationBase

			this.translation.animation.style.backgroundImage = `url(${image})`
		}

		if (this.translation.streaming){
			const image = this.betradarId === streaming && current === 'matchLiveStreaming' ? streamActive : streamBase

			this.translation.streaming.style.backgroundImage = `url(${image})`
		}
	}

	writeEventIdToStorage =(key)=> {

		const translation = getTranslationIds()

		writeToStorage('translation', {
			...translation,
			[key]:this.betradarId,
		})
	}

	writeToStorageCurrentTab =(key)=> {
		let currentTab = ''

		if (key === 'animation'){
			currentTab = 'matchLiveAnimation'
		}

		if (key === 'streaming'){
			currentTab = 'matchLiveStreaming'
		}

		writeToStorage('currentTab', currentTab)
	}

	streamTemplate =()=> {
		this.translation.streaming = createElement({
			type:'div',
			classes:['event-translation'],
			listeners:[{event:'click', cb: ()=> {
					this.writeToStorageCurrentTab('streaming')
					this.writeEventIdToStorage('streaming')
				}}],
			style:{
				backgroundImage: `url(${streamBase})`
			}
		})

		return this.translation.streaming
	}

	animationTemplate =()=> {

		this.translation.animation = createElement({
			type:'div',
			classes:['event-translation'],
			listeners:[{event:'click', cb: ()=> {
					this.writeToStorageCurrentTab('animation')
					this.writeEventIdToStorage('animation')
				}}],
			style:{
				backgroundImage: `url(${animationBase})`
			}
		})

		return this.translation.animation
	}

	appendAnimationIcon =()=> {

		if (this.enrichment?.animation?.includes('betradarTracker') && !this.translation.animation){
			const { animation } = getTranslationIds()

			if (!animation){
				this.writeEventIdToStorage('animation')
			}

			this.node.append(this.animationTemplate())
		}

	}

	appendLiveStreamingIcon =()=> {

		const streamingData = getLiveStreamingData()

		if (!!streamingData?.find(({ id }) => id === this.betradarId) && !this.translation.streaming){

			const { streaming } = getTranslationIds()

			if (!streaming){
				this.writeEventIdToStorage('streaming')
			}

			this.node.append(this.streamTemplate())
		}
	}

	render =()=> {

		this.node = createElement({
			type:'div',
			classes:['event-translation__wrap', 'flex-container', 'align-center', 'align-middle']
		})

		this.appendAnimationIcon()
		this.appendLiveStreamingIcon()

		storageEmitter.writeEventToStorage('translation', this.lightIcon)
		storageEmitter.writeEventToStorage('currentTab', this.lightIcon)
		storageEmitter.writeEventToStorage('liveTranslations', this.appendLiveStreamingIcon)

		return this.node
	}

	destroy =()=> {
		storageEmitter.removeCallback('translation', this.lightIcon)
		storageEmitter.removeCallback('currentTab', this.lightIcon)
		storageEmitter.removeCallback('liveTranslations', this.appendLiveStreamingIcon)

	}

}
