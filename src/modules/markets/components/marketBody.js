import { OverUnder } from './overUnder/overUnder'
import { Anytime } from './anytime/anytime'
import { Correct } from './correct/correct'
import { HandicapWay } from './handicap/handicapWay'
import { DefaultBody } from './defaultBody/defaultBody'

const correct = [889, 913, 962, 1050, 1051, 187, 194]
const overUnder = [
	156,
	157,
	158,
	62,
	63,
	64,
	17,
	18,
	19,
	82,
	83,
	84,
	212,
	214,
	215,
	219,
	222,
	701,
	702,
	239,
	241,
	242,
	257,
	258,
	259,
	265,
	266,
	267,
	269,
	692,
	224,
	229,
	693,
	685,
]
const handicap = [61, 210, 218, 282, 16, 237, 256, 689, 691, 223]
const anytime = [
	1054,
	15,
	856,
	891,
	253,
	36,
	37,
	890,
	892,
	893,
	914,
	963,
	1034,
	946,
	948,
	966,
	967,
	915,
	925,
	949,
	908,
	912,
	919,
	35,
	499,
	500,
	42,
	910,
	246,
	273,
	201,
]

export class MarketBody {
	constructor(outcomes, groupId, competitors) {
		this.groupId = groupId
		this.outcomes = outcomes
		this.competitors = competitors

		this.div = null
		this.type = 'div'
		this.classes = ['maTable__row']
	}

	init = () => {
		if (overUnder.includes(this.groupId)) {
			return new OverUnder(this.outcomes, this.competitors, this.groupId)
		}

		if (anytime.includes(this.groupId)) {
			return new Anytime(this.outcomes, this.competitors, this.groupId)
		}

		if (correct.includes(this.groupId)) {
			return new Correct(this.outcomes, this.competitors, this.groupId)
		}

		if (this.groupId === 210 || this.groupId === 14) {
			return new HandicapWay(this.outcomes, this.competitors, this.groupId)
		}

		return new DefaultBody(this.outcomes, this.competitors, this.groupId)
	}
}
