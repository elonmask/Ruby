export class MyBetsCenterTemplate {
	render =()=> {
		return `<div id="my-bets-mainContainer" class="my-bets-mainContainer " data-simplebar>
					<div class="myBets-navLinks">
							<a href='./#/mybets/unsettled' data-name="unsettled" class="font white my_bets__link">Unsettled</a>
							<a href='./#/mybets/settled' data-name="settled" class="font white my_bets__link">Settled</a>
								<a href='./#/mybets/all' data-name="all" class="font white my_bets__link">All</a>
					</div>
					<div class="myBets-body" id="myBets-body"></div>
			</div>
		`
	}
}
