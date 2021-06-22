import { MainBets } from './rightSide/mainBets'
import { EventTranslation } from './leftSide/eventTranslation'
import { createElement } from '../../../helpers/createElement'
import {  isEqualOutcomes, isEmpty } from '../../../helpers/utils'
import _ from 'lodash'

export class EventRightTable {
	constructor({ competitors, currentOdd, oddsCount, sportId, leagueId, id, enrichment, externalIds, marketName }) {
		this.div = null
		this.type = 'div'
		this.classes = ['inplayTable__right']

		this.id = id
		this.sportId = sportId
		this.leagueId = leagueId
		this.oddsCount = oddsCount
		this.currentOdd = currentOdd
		this.competitors = competitors
		this.marketName = marketName

		this.mainBetsInstance = new MainBets(
			this.currentOdd,
			this.competitors,
			this.oddsCount,
			{
				id: this.id,
				sportId: this.sportId,
				leagueId: this.leagueId,
			},
			this.marketName
		)
		this.translations = new EventTranslation(enrichment, externalIds)

	}

	appendComponent = () => {
		this.div.append(this.mainBetsInstance.render())
		this.div.append(this.translations.render())
	}

	render = () => {
		this.div = createElement({
			type: this.type,
			classes: this.classes,
		})

		this.appendComponent()

		return this.div
	}

	update = ({ currentOdd, oddsCount }) => {

		if (!currentOdd.odds){
			this.currentOdd = currentOdd
			this.mainBetsInstance.update({ currentOdd:null })
		}

		if (currentOdd.odds && !this.currentOdd.odds){
			this.currentOdd = currentOdd
			this.mainBetsInstance.update({ currentOdd })
		}

		if (currentOdd.odds && this.currentOdd.odds) {
			if (!isEqualOutcomes(this.currentOdd.odds[0], currentOdd.odds[0])) {
				this.currentOdd = currentOdd
				this.mainBetsInstance.update({ currentOdd })
			}
		}

		if (oddsCount) {
			if (!_.isEqual(this.oddsCount, oddsCount)) {
				if (!isEmpty(oddsCount)) {
					this.oddsCount = oddsCount
					this.mainBetsInstance.update({ oddsCount })
				}
			}
		}
	}

	destroy =()=> {
		// this.componentInstance.destroy()
		this.translations.destroy()
	}

}
