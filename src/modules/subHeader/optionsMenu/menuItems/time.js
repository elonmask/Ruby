import { createElement } from '../../../../helpers/createElement'
import { getTZ, getTZA } from '../../../../selectors/configSelectors'
import { findNode } from '../../../../helpers/utils'

export class Time {
	constructor() {
		this.node = null
		this.type = 'a'
		this.classes = ['bottom-menu-link-item', 'last']
		this.itemName = 'time'
		this.clockNode = null
		this.timer = null
	}

	appendHTML = () =>
		`
				<span class="fa fa-calendar"></span>
        <span class="ml" id="clock"></span>
		`

	updateTime = () => {
		const tza = Number(getTZA())

		let date = new Date(),
			hh = date.getUTCHours() + parseInt(tza / 60) - 1,
			mm = date.getUTCMinutes() + (tza % 60),
			ss = date.getSeconds()

		if (hh < 10) hh = '0' + hh
		if (mm < 10) mm = '0' + mm
		if (ss < 10) ss = '0' + ss
		this.clockNode.innerText = `${hh}:${mm}:${ss} ${getTZ()}`
		this.timer = setTimeout(this.updateTime, 1000)
	}

	render = () => {
		this.node = createElement({
			type: this.type,
			classes: this.classes,
		})

		this.node.innerHTML = this.appendHTML()

		this.clockNode = findNode('#', 'clock', this.node)

		this.updateTime()

		return this.node
	}

	destroyInnerItems = () => null

	renderInnerItems = () => null
}
