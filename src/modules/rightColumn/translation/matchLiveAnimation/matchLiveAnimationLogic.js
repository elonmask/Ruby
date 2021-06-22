import { getTranslationIds } from '../../../../selectors/selectors'
import { createElement } from '../../../../helpers/createElement'
import { findNode } from '../../../../helpers/utils'
import { storageEmitter } from '../../../../storage/storageEmmiter'
import { links } from '../../../../links/links'

export class MatchLiveAnimationLogic {
	constructor() {

		this.node = null
		this.type = 'div'
		this.classes = ['match-live-body', 'flex-container']

		this.betradarId = null
	}

	checkBetradarId = () => {

		this.node.style.height = '100%'
		const id = getTranslationIds().animation

		if (!id){
			return this.emptyMessage()
		}

		try {
			this.betradarId = id
			this.appendIframe()
		} catch (e){
			this.emptyMessage()
		}
	}

	appendIframe = () => {
		this.node.innerHTML = `
			<iframe
				src="${links.matchLiveAnimation + this.betradarId}" 
				style="width: 100%; height: 100%"
			>
		 </iframe>`

		const iframe = findNode('', 'iframe', this.node)

		iframe.onload = () => {
			iframe.contentWindow.postMessage('message', '*')

			window.addEventListener('message', event => {
				if (event) {
					const height = event.data.height
					this.node.style.height = height + 'px'
				}
			})
		}
	}

	init = () => {

		this.node = createElement({
			type:this.type,
			classes: this.classes
		})

		this.checkBetradarId()

		storageEmitter.writeEventToStorage('translation', this.checkBetradarId)

		return this.node
	}

	emptyMessage =()=> {
		this.node.innerHTML = `
				<div class="flex-container align-center-middle empty-translation__message">
						<p class="font white">No animation available</p>
				</div>`
	}

	destroy = () => {
		storageEmitter.writeEventToStorage('translation', this.checkBetradarId)
	}
}
