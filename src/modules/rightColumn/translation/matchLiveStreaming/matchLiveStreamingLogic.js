import videojs from 'video.js'
import { createElement } from '../../../../helpers/createElement'
import { isLoggedIn } from '../../../../selectors/configSelectors'
import { getLiveStreamingData, getTranslationIds } from '../../../../selectors/selectors'
import { storageEmitter } from '../../../../storage/storageEmmiter'

import 'video.js/dist/video-js.min.css'

export class MatchLiveStreamingLogic{
	constructor() {
			this.node = null
			this.type = 'div'
			this.classes = ['video-wrapper']

			this.player = null
			this.rtmpLink = null
			this.hlsLink = null

			this.authWarning = 'Please log in and watch live translation'
			this.emptyWarning = 'No live streaming available'

	}

	getOptions =()=> ({
		volume : 100,
		autoplay : true,
		controls : false,
		preload : 'none',
		sources :[
			{
				src: this.rtmpLink
			},
			{
				src: this.hlsLink,
			},
		]
	})

	appendVideo =()=> {
		this.clearContainer()

		const player = createElement({
			type: 'video'
		})

		this.player = videojs(player, this.getOptions(), () => {
			console.log('player initialized')
		})


		this.node.append(player)
	}

	errorMessage =(message)=> {

		this.clearContainer()

		const div = createElement({
			type:'div',
			classes:['flex-container','align-center-middle', 'empty-translation__message']
		})

		div.innerHTML = `<p class="font white">${message}</p>`
		this.node.append(div)
	}

	getLinks = ()=> {

		const { streaming } = getTranslationIds()
		const allStreaming = getLiveStreamingData()

		if (!allStreaming){
			return this.errorMessage(this.emptyWarning)
		}

		const currentEventStreamingData = allStreaming.find(({ id }) => id === streaming)

		if (!currentEventStreamingData){
			return this.errorMessage(this.emptyWarning)
		}

		const { hls, rtmp } = currentEventStreamingData

		this.rtmpLink = rtmp
		this.hlsLink = hls

		this.appendVideo()

	}

	init =()=> {

		this.node = createElement({
			type: this.type,
			classes: this.classes
		})

		isLoggedIn() ? this.getLinks() : this.errorMessage(this.authWarning)

		storageEmitter.writeEventToStorage('translation', this.update)

		return this.node
	}

	update =()=> {

		if (!isLoggedIn()){
			return this.errorMessage(this.authWarning)
		}

		this.clearPlayer()
		this.clearContainer()

		this.getLinks()
	}

	clearContainer =()=> {
		this.node.innerHTML = ''
	}

	clearPlayer =()=> {
		if (this.player){
			this.player.dispose();
			this.player = null
		}
	}

	destroy =()=> {

		if (this.node){
			this.node.remove()
		}

		storageEmitter.removeCallback('translation', this.update)
	}

}
