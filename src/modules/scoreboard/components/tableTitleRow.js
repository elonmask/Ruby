import { createElement } from '../../../helpers/createElement'
import { findNode } from '../../../helpers/utils'
import { Timer } from '../../../helpers/timer'

export class TableTitleRow {
	constructor(titles, id, clock, periodId) {
		this.titles = titles
		this.id = id
		this.clock = clock
		this.periodId = periodId

		this.div = null
		this.type = 'div'
		this.classes = ['table__row', 'title']

		this.timeNode = null
		this.timer = null
		this.remaining = null
	}

	startTimer = () => {
		this.timer = new Timer({
			clock: this.clock,
			node: this.timeNode,
			periodId: this.periodId,
		})

		this.timer.init()
	}

	render = () => {
		this.div = createElement({
			type: this.type,
			classes: this.classes,
		})

		this.div.innerHTML = `
							<div class="table__cell">
									<p class="font text-left ml  scoreboardText primary scoreboardTime"></p>
							</div>
							${this.titles
								.map(
									title =>
										`<div class="table__cell">
												<div class="scoreboardTitle ${this.id === 1 ? 'icon' : ''} primary ${title}"> 
														${this.id !== 1 ? title : ''}</div>
										 </div>`
								)
								.join('')}`

		this.timeNode = findNode('.', 'scoreboardTime', this.div)

		this.startTimer()

		return this.div
	}

	update = ({ eventClock, periodId }) => {
		this.timer.update({ eventClock, periodId })

		this.clock = eventClock
		this.periodId = periodId
	}

	destroy = () => {
		this.div.remove()
		this.timer.destroy()
		this.timer = null
	}
}
