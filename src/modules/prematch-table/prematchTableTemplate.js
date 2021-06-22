export class PrematchTableTemplate {

	constructor() { }

	getSportName = () => {

	}

	render = () => (
		`<div id="mainContainer" class="prematch-table-container">
      <div id="prematch-forBanner">
        <div class="flex-container align-middle background banner small shadow" style="background-image:url('./src/img/banner/big/1.png');">
				  <div class="lex-container align-center-middle banner__title">
					  <p id="headerIcon" class="icon" style=""></p>
				  </div>
				    <p id="headerTitle" class="font banner__text"></p>
        </div>
      </div>

      <div id="prematch-forStat"><div class="prematchTable">
				<div class="prematchTable__row margin">
					<div class="prematchTable__cell margin">
						<div class="flex-container align-middle align-justify prematchCategory">
							<p id="titleLeagueName" class="font"></p>
							<div class="flex-container align-middle">
								<a class="fa fa-bar-chart prematchLink"></a>
								<a class="fa fa-refresh prematchLink"></a>
							</div>
						</div>
					</div>
				</div>
				<div class="prematchTable__row">
					<div class="prematchTable__cell">
						<p id="titleCompetition" class="font title prematchTitle"></p>
						<p id="titleDate" class="font prematchText"></p>
					</div>
				</div>
				
      </div>
			</div>
			
			<div class="maTable__row" id="prematch-forTable">
				<div class="maTable__row">
					<div class="maTable__cell">
						<div class="maTable__category closed">
							<p class="text font">MAIN BETS</p>
						</div>
					</div>
				</div>
			</div>
			
</div>`
	)
}
