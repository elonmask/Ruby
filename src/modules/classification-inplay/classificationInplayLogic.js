import { SportCategoryAsideLive } from './components/sportCategoryAsideLive'
import { storageEmitter } from '../../storage/storageEmmiter'
import { findNode, getDifference } from '../../helpers/utils'
import { getInplay } from '../../selectors/selectors'

export class ClassificationInplayLogic {
	constructor() {
		this.node = null
		this.data = getInplay()

		this.sportsInstances = {}
	}

	addSportCategory = sport => {
		this.sportsInstances[sport.id] = new SportCategoryAsideLive(sport)
		this.node.append(this.sportsInstances[sport.id].render())
	}

	removeSportCategory = id => {
		this.sportsInstances[id].destroy()

		this.sportsInstances = Object.keys(this.sportsInstances).reduce(
			(acc, key) => {
				if (id !== key) {
					acc[key] = this.sportsInstances[key]
				}
				return acc
			},
			{}
		)
	}

	renderSports = () => {
		this.data.forEach(sport => this.addSportCategory(sport))
	}

	update = () => {
		const data = getInplay()

		const old = this.data.map(item => item.id)
		const current = data.map(item => item.id)

		const { removed, added, others } = getDifference(old, current)

		if (removed.length) {
			removed.forEach(id => {
				this.removeSportCategory(id)
			})
		}

		if (added.length) {
			added.forEach(key => {
				const sport = data.find(sport => sport.id === key)

				this.addSportCategory(sport)
			})
		}

		if (others.length) {
			others.forEach(id => {
				const sport = data.find(sport => sport.id === id)
				this.sportsInstances[id].update(sport)
			})
		}

		this.data = data
	}

	init = () => {
		this.node = findNode('#', 'classification_inplay_container')

		this.renderSports()

		storageEmitter.writeEventToStorage('inplay', this.update)
	}

	destroy = () => {
		storageEmitter.removeCallback('inplay', this.update)

		Object.values(this.sportsInstances).forEach(sport => sport.destroy())

		this.node.remove()
	}
}
