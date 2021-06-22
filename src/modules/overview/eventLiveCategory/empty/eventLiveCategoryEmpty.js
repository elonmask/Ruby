export class EventLiveCategoryEmpty {
	render =()=> {
		return `
			<div class="inplay-event-wrapper">
				<div class="flex-container inplayTable">
					<div class="flex-container align-middle inplayTable__left">
						<a  class="flex-container align-justify align-middle inplayTeamScoreInfo">
							<div class="inplayTeamTime">
								<p class="font team-period"></p>
								<p class="font bold team-time"></p>
							</div>
							 <div style="width: 55%; flex: 1 1 0%;">
							 <p class="font ellipsis text-left team-name"></p>
							 <p class="font ellipsis text-left team-name"></p> 
							</div>
							<div style="width: 10%;">
									<p class="font text-center team-score"></p>
									<p class="font text-center team-score"></p>
							</div>
						</a>
							</div>
					<div class="inplayTable__right">
						<div class="main-bets inplay-right_menu active">
							<div class="flex-container align-middle market_title full_width"></div>
						</div>
						<div class="event-translation__wrap flex-container align-center align-middle">
							<div class="event-translation"></div>
						</div>
					</div>	
				</div>
			</div>`
	}
}
