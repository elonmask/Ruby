import { createElement } from '../../../../helpers/createElement'
import { findNode, isEmpty, isEqualOutcomes } from '../../../../helpers/utils'
import { storageEmitter } from '../../../../storage/storageEmmiter'
import { Timer } from '../../../../helpers/timer'

export class EventTime {
	constructor(additionalData, isSet = false) {
		this.additionalData = additionalData
		this.isSet = isSet

		this.timeNode = null
		this.timer = null
		this.periodNode = null

		this.div = null
		this.type = 'div'
		this.classes = ['inplayTeamTime']
	}

	initTimer = () => {
		if (this.additionalData) {
			const { eventClock, periodId } = this.additionalData

			this.timer = new Timer({
				clock: eventClock,
				periodId,
				node: this.timeNode,
			})
			this.timer.init()
		}
	}

	periodPartsTemplate = () => {
		const periods = {
			6: 1,
			7: 2,
			41: 3,
			42: 4,
		}

		const current = periods[this.additionalData?.periodId?.data || '6']

		return (current || 1) + ` half`
	}

	setPartsTemplate = () => {
		return (
			(this.additionalData?.scoreboard?.data?.periodScores?.length || '') +
			` set`
		)
	}

	tournamentTemplate = () => {
		return (
			``
		)
	}

	setTimer = () =>
		`<div class="text-center">
				<p class="font team-period">${this.setPartsTemplate()}</p>
		 </div>`

	periodTimer = () =>
		`<p class="font team-period">${this.periodPartsTemplate()}</p>
		 <p class="font bold team-time"></p>`

	addHTML = () => {
		this.div.innerHTML = this.isSet ? this.setTimer() : this.periodTimer()
	}

	render = () => {
		this.div = createElement({
			type: this.type,
			classes: this.classes,
		})

		this.addHTML()

		if (!this.isSet) {
			this.timeNode = findNode('.', 'team-time', this.div)
			this.initTimer()
		}

		this.periodNode = findNode('.', 'team-period', this.div)

		return this.div
	}

	update = additionalData => {
		if (!isEmpty(additionalData) && !this.isSet) {
			const { eventClock, periodId } = additionalData

			if (
				!isEqualOutcomes(
					{
						clock: this.additionalData.eventClock,
						period: this.additionalData.periodId,
					},
					{ clock: eventClock, period: periodId }
				)
			) {
				this.additionalData = additionalData

				this.timer.update({ eventClock, periodId })
				if (this.additionalData == null) {
					this.periodNode.innerText = '';
				} else {
					this.periodNode.innerText = this.isSet
					? this.setPartsTemplate()
					: this.periodPartsTemplate()
				}
			}
		}
	}

	destroy = () => {
		if (!this.isSet) {
			this.timer.destroy()
		}
	}
}
