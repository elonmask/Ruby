export class TableRow {
	constructor(first, data, idx, current) {
		this.firstCell = first
		this.data = data
		this.dataKey = idx === 0 ? 'homeScore' : 'awayScore'
		this.current = current ? current.data : null

		this.currentServ = {
			homeScore: 'HOME',
			awayScore: 'AWAY',
		}
	}

	render = () => {
		return `<div class="table__row">
							 <div class="table__cell">
										<div class="flex-container align-middle">
										${
											this.current
												? `<p class="scoreboardBadge ${
														this.currentServ[this.dataKey] === this.current
															? 'second'
															: 'primary'
												  } "></p>`
												: ''
										}
											<p class="scoreboardText font white ellipsis title_row__cell text-left ">${this.firstCell}</p>
										</div>
									</div>
									${this.data
										.map(
											item =>
												`<div class="table__cell">
													<p class="font scoreboardText primary">${item[this.dataKey]}</p>
												</div>`
										)
										.join('')}
						</div>`
	}
}
