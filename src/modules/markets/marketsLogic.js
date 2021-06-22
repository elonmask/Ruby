import { MarketsWrapper } from './components/marketsWrapper'
import { EmptyMessage } from './components/emptyMessage'
import { transformEventData } from '../../helpers/transform/transform'
import { findNode, getDifference, isEmpty } from '../../helpers/utils'
import { lightButton } from '../../storage/nodes/betButtonsStorage'
import { getEvent } from '../../selectors/selectors'
import { storageEmitter } from '../../storage/storageEmmiter'

export class MarketsLogic {
	constructor() {
		this.type = 'marketsLogic'
		this.event = getEvent()
		this.markets = transformEventData(this.event.odds)
		this.competitors = this.event.competitors
		this.node = null

		this.marketsInstances = {}
		this.emptyMessage = new EmptyMessage()
		this.isActiveEmpty = false
	}

	updateMarkets = () => {
		if (this.event.id !== getEvent().id) {
			this.destroy()
			return
		}

		this.event = getEvent()
		const updatedMarkets = transformEventData(this.event.odds)

		const baseKeys = Object.keys(this.markets)
		const updatedKeys = Object.keys(updatedMarkets)

		const { removed, added, others } = getDifference(baseKeys, updatedKeys)

		if (!isEmpty(removed)) {
			this.destroyEmpty()
			removed.forEach(marketKey => {
				this.removeMarkets(marketKey)
			})
		}

		if (!isEmpty(added)) {
			this.destroyEmpty()
			added.forEach(key => {
				this.addMarkets(key, updatedMarkets[key])
			})
		}

		others.forEach(key => {
			this.marketsInstances[key].update(updatedMarkets[key])
		})

		this.markets = updatedMarkets
	}

	addMarkets = (key, odd) => {
		this.marketsInstances[key] = new MarketsWrapper(odd, this.competitors)
		this.node.append(this.marketsInstances[key].render())
	}

	removeMarkets = key => {
		this.marketsInstances[key].destroy()

		this.markets = Object.keys(this.markets).reduce((acc, marketKey) => {
			if (key !== marketKey) {
				acc[key] = this.markets[key]
			}
			return acc
		}, {})
	}

	renderMarkets = () => {
		if (isEmpty(this.markets)) {
			this.emptyTemplate()
			return
		}

		Object.keys(this.markets).forEach(key => {
			const odd = this.markets[key]
			this.addMarkets(key, odd)
		})
	}

	emptyTemplate = () => {
		this.isActiveEmpty = true
		this.node.append(this.emptyMessage.render())
	}

	destroyEmpty = () => {
		if (!this.isActiveEmpty) {
			this.emptyMessage.destroy()
		}
		this.isActiveEmpty = false
	}

	init = () => {
		this.node = findNode('#', 'maTable')
		this.renderMarkets()

		lightButton()

		storageEmitter.writeEventToStorage('event', this.updateMarkets)
	}

	destroy = () => {
		storageEmitter.removeCallback('event', this.updateMarkets)

		Object.values(this.marketsInstances).forEach(instance => instance.destroy())
	}
}
