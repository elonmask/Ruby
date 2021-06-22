import { Table } from './components/table'
import { findNode } from '../../helpers/utils'
import { getEvent } from '../../selectors/selectors'
import { storageEmitter } from '../../storage/storageEmmiter'
import { TableForTournament } from './components/tableForTournament'

export class ScoreboardLogic {
	constructor() {
		this.type = 'scoreboardLogic'
		this.event = getEvent()
		this.node = null
		this.scoreboardTable =
			this.event.eventType === 'Tournament'
				? new TableForTournament(this.event)
				: new Table(this.event)
	}

	check = () => {
		if (this.event.id !== getEvent().id) {
			this.destroy()
		}
	}

	init = () => {
		this.node = findNode('.', 'scoreboardScreen')

		this.node.append(this.scoreboardTable.render())

		storageEmitter.writeEventToStorage('event', this.update)
		storageEmitter.writeEventToStorage('event', this.check)
	}

	update = () => {
		const event = getEvent()
		if (this.event.id !== event.id) {
			this.destroy()
			return
		}

		if (event.additionalData) {
			const {
				scoreboard,
				soccerStatistic,
				currentServer,
				eventClock,
				periodId,
			} = event.additionalData

			this.scoreboardTable.update({
				scoreboard,
				soccerStatistic: event.id === 1 ? soccerStatistic : {},
				currentServer,
				eventClock,
				periodId,
			})
		}
	}

	destroy = () => {
		this.scoreboardTable.destroy()
		storageEmitter.removeCallback('event', this.update)
		storageEmitter.removeCallback('event', this.check)
	}
}
