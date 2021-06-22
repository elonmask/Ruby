import { SportLiveCategory } from './sportLiveCategory/sportLiveCategory'
import { SliderLogic } from '../slider/sliderLogic'
import { getCurrentView, getCurrentViewId } from '../../selectors/selectors'
import { writeToStorage } from '../../storage/storageMethod'
import { getRequest, getRequestWithLoader } from '../../helpers/utils'
import { transformInplayData } from '../../helpers/transform/transform'
import { storageEmitter } from '../../storage/storageEmmiter'
import { links } from '../../links/links'

export class OverviewLogic {
	constructor() {
		this.containerNode = null
		this.data = null
		this.sportCategory = null
	}

	setCurrentView = () => {
		let currentView = this.data.find(
			sport => sport.id === Number(getCurrentViewId())
		)

		if (!currentView) {
			currentView = this.data[0]
			writeToStorage('currentViewId', currentView.id)
		}

		writeToStorage('currentView', currentView)
	}

	changeCurrentView = () => {
		writeToStorage('translation', { animation: null, streaming: null })

		this.setCurrentView()
		this.drawData()
	}

	loadData = async () => {
		try {
			const data = await getRequest(links.inplayTree)

			this.data = transformInplayData(data)

			this.setCurrentView()
			writeToStorage('inplay', this.data)
		} catch (e) {
			console.log(e)
		}
	}

	drawData = () => {
		const current = getCurrentView()

		if (this.sportCategory) {
			this.sportCategory.destroy()
		}

		this.sportCategory = new SportLiveCategory(current)

		this.containerNode.innerHTML = ''
		this.containerNode.append(this.sportCategory.render())
	}

	initSlider = () => {
		const slider = new SliderLogic()
		slider.renderSliderItem()
	}

	showData = async () => {
		try {
			await getRequestWithLoader(this.loadData)()
			await this.drawData()
			await this.initSlider()

			await storageEmitter.writeEventToStorage(
				'currentViewId',
				this.changeCurrentView
			)
		} catch (e) {
			console.log(e)
		}
	}

	init = () => {
		this.containerNode = document.querySelector('#inplay_container')
		this.showData()
		// window.addEventListener('hashchange', this.clearTimer)
	}

	destroy = () => {
		this.sportCategory.destroy()

		storageEmitter.removeCallback('currentViewId', this.changeCurrentView)
		// window.removeEventListener('hashchange', this.clearTimer)
	}
}
