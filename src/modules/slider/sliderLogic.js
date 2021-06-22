import { SliderItem } from './sliderItem'
import { writeToStorage } from '../../storage/storageMethod'
import { getCurrentViewId, getInplay } from '../../selectors/selectors'
import { findAllNodes, getDifference } from '../../helpers/utils'
import { storageEmitter } from '../../storage/storageEmmiter'
import { config } from '../../config/config';

let slider = null

export class SliderLogic {
	constructor() {
		if (slider) {
			return slider
		}

		this.slider = null

		slider = this
	}

	lightLink = () => {
		const active = getCurrentViewId()

		const sliderItems = findAllNodes('.', 'slider__item', this.slider)

		sliderItems.forEach(link =>
			link.dataset.id === active.toString()
				? link.classList.add('active')
				: link.classList.remove('active')
		)
	}

	activeLink = e => {
		let active = getCurrentViewId()
		const currentLink = e.target.closest('.slider__item')

		if (currentLink) {
			active = currentLink.dataset.id
		}

		writeToStorage('currentViewId', active)
	}

	createSliderItem =(sport, active)=> {
		if (sport.inPlayMatchCount !== 0){
			const sportItem = new SliderItem(sport, Number(active))
			this.slider.append(sportItem.render())
		}
	}

	renderSliderItem = () => {
		this.initSliderTrack()
		const active = getCurrentViewId()
		let data = getInplay() || []

		data = data?.sort((a, b) => a.priority - b.priority) ?? []

          if (data.length > 0) {
            const nonZero = data.filter(a => a.priority !== 0)
            const zero = data.filter(a => a.priority == 0)
            data = _.concat(nonZero, zero)
          }

		data.forEach(sport => {
			if (!config.EX_SPORTS.includes(sport.id)) {
				this.createSliderItem(sport, active)
			}
		})
	}

	translate = num => {
		this.slider.style.transform = `translate(${num}px, ${0}px)`
	}

	right = () => {
		if (this.slider.scrollWidth > this.slider.clientWidth) {
			let num = this.slider.clientWidth - this.slider.scrollWidth - 30
			this.translate(num)
		}
	}

	left = () => {
		this.translate(0)
	}

	initSliderTrack = () => {
		this.slider = document.querySelector('.slider__track')
		this.slider.addEventListener('click', this.activeLink)

		storageEmitter.writeEventToStorage('currentViewId', this.lightLink)
		storageEmitter.writeEventToStorage('inplay', this.updateSlider)
	}

	init = () => {
		const prev = document.getElementById('slider__prev')
		const next = document.getElementById('slider__next')

		prev.addEventListener('click', this.left)
		next.addEventListener('click', this.right)
	}

	destroy = () => {}

	updateSlider = () => {
		const active = getCurrentViewId()
		const sliderItems = findAllNodes('.', 'slider__item', this.slider)

		const itemsIds = [...sliderItems].map(node => Number(node.dataset.id))
		const sportsIds = getInplay().map(sport => sport.id)

		const { removed, added } = getDifference(itemsIds, sportsIds)

		if (removed.length) {
			removed.forEach(item => {
				sliderItems.forEach(node => {
					if (node.dataset.id === item.toString()) {
						this.slider.removeChild(node)
					}
				})
			})
		}

		if (added.length) {
			added.forEach(item => {
				getInplay().forEach(sport => {
					//if (!config.EX_SPORTS.includes(sport.id)) {
						if (item === sport.id) {
							this.createSliderItem(sport, active)
						}
					//}
				})
			})
		}
	}
}
