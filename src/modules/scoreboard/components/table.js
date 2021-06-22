import { TableTitleRow } from './tableTitleRow'
import { TableRow } from './tableRow'
import { transformPeriodScores } from '../../../helpers/transform/scoreboardTransform'
import { findNode, isEqualOutcomes } from '../../../helpers/utils'
import { createElement } from '../../../helpers/createElement'
import { sportsScoreboardTitles } from '../../../helpers/transform/scoreboardTransform'

export class Table {
	constructor(event) {
		this.event = event

		const { scoreboard, soccerStatistic, currentServer, eventClock, periodId } =
			this.event?.additionalData || {}

		this.scoreboardData = scoreboard
		this.soccerStatistic = soccerStatistic
		this.currentServer = currentServer
		this.eventClock = eventClock
		this.periodId = periodId

		this.tableData = null
		this.titles = null

		this.div = null
		this.type = 'div'
		this.classes = ['table']

		this.tableBodyNode = null
		this.titleRow = null

		if (this.scoreboardData) {
			this.transformAdditionalData()
		}
	}

	transformAdditionalData = () => {
		const {
			periodScores,
			currentGamePoints,
			currentAwayScore,
			currentHomeScore,
		} = this.scoreboardData.data

		const data = transformPeriodScores({
			periodScores,
			currentGamePoints,
			currentAwayScore,
			currentHomeScore,
			sportId: this.event.sportId,
			soccerStatistic: this.soccerStatistic,
		})

		if (this.event.sportId !== 1) {
			this.titles =
				sportsScoreboardTitles[this.event.sportId] ||
				sportsScoreboardTitles.defaultTitles
			this.tableData = data
			return
		}

		this.titles = Object.keys(data)
		this.tableData = Object.values(data)
	}

	appendTitleRowHTML = () => {
		this.titleRow = new TableTitleRow(
			this.titles,
			this.event.sportId,
			this.eventClock,
			this.periodId
		)

		this.div.prepend(this.titleRow.render())
	}

	appendBodyHTML = () => {
		this.tableBodyNode.innerHTML = `
			${this.event.competitors
				.map(({ name }, idx) =>
					new TableRow(name, this.tableData, idx, this.currentServer).render()
				)
				.join('')}`
	}

	render = () => {
		this.div = createElement({
			type: this.type,
			classes: this.classes,
		})

		this.div.innerHTML = `<div class="table__body"></div>`

		this.tableBodyNode = findNode('.', 'table__body', this.div)

		this.appendTitleRowHTML()
		this.appendBodyHTML()
		return this.div
	}

	update = ({
		scoreboard,
		soccerStatistic,
		currentServer,
		eventClock,
		periodId,
	}) => {
		if (
			!isEqualOutcomes(
				{
					scoreboard: this.scoreboardData,
					statistic: this.soccerStatistic,
					currentServer: this.currentServer,
				},
				{ scoreboard, statistic: soccerStatistic, currentServer }
			)
		) {
			this.scoreboardData = scoreboard
			this.soccerStatistic = soccerStatistic
			this.currentServer = currentServer
			this.transformAdditionalData()
			this.appendBodyHTML()
		}

		if (this.eventClock) {
			if (
				!isEqualOutcomes(
					{ ...this.eventClock, periodId: this.periodId },
					{ ...eventClock, periodId }
				)
			) {
				this.eventClock = eventClock
				this.periodId = periodId

				this.titleRow.update({
					eventClock,
					periodId,
				})
			}
		}
	}

	destroy = () => {
		if (this.titleRow) {
			this.titleRow.destroy()
		}
		this.div.remove()
	}
}
