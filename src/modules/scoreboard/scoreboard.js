window.Scoreboard = class Scoreboard {
		constructor() {
			this.html = '';
			this.timerId = '';
		}

		defaultScoreboard(kind, ev){
			const { CL,TG,CT,SG } = ev;
			const div = document.createElement('div');

			div.innerHTML = `
			<div class="scorebordImg" style="background-image: url(img/scoreboard/1.png)"></div>
			<div class="scoreboardMenu">
				<div class="flex-container align-middle scoreboardMenu__wrapper big">
					<p class="sports-${CL}"></p>
					<p class="font primary ml text-transform">${(TG && TG.CT) || CT}:</p>
					<p class="font ellipsis ml">${CT}</p>
				</div>
				<div class="font scoreboardShow" > Show </div>
				<p class="font text-nowrap" id="match_time"></p>
			</div>

			${kind}

			<div class="scoreboardMenu">
				${this.templateForScoreboardMenu(SG)}
			</div> `

			div.querySelector('#show_board_menu').addEventListener('click', this.doStuff);
			div.querySelector('.scoreboardShow').addEventListener('click', this.showScreen);
			div.querySelector('.scoreboardHide').addEventListener('click', this.hideScreen);

			return div
		}

		templateForScoreboardMenu =(sg)=> {
			let ST;
			let last;
			let icon;

			if (sg) {
				ST = sg.ST;
				last = ST[0].LA;
				icon = this.eventIcon(ST[0].IC);
			} else {
				last = '';
				icon = 'None';
				ST = [];
			}

			return `
		<div class="flex-container align-middle align-left scoreboardMenu__wrapper">
			<div class="scoreboardIcon ${icon}"></div>
			<p class="font ellipsis ml">${last}</p>
		</div>
		<div class="flex-container align-middle align-right scoreboardMenu__wrapper">
			<a class="fa fa-sort scoreboardMenu__link"></a>
			<a class="fa fa-signal scoreboardMenu__link"></a>
			<a class="fa fa-angle-down scoreboardMenu__link" id="show_board_menu"></a>
		</div>
		<div class="scoreboardToggle flex-container flex-dir-column align-left scroll none">
		
			${ST.map(ev => {
				return `<div 	
							class="flex-container align-middle scoreboardToggle__item" 
							data-or="${ev.OR}"
							style="order:${ev.OR}">
						<div class="scoreboardIcon ${this.eventIcon(ev.IC)}"></div>
						<p class="font ellipsis">${ev.LA}</p>
				</div>`
			}).join('')}
		
		</div>`
		};

		templateForSoccerStatistic =(es)=> {
			const { SC } = es;
			return SC.map(sc => {
				const {SL, NA, OR, ID, IT} = sc;
				if (Number(ID) == 0){
					return `<div class="column"
							data-or="${OR}"
							data-id="${ID}"
							data-it="${IT}">
							<div class="cell title">${NA}</div>
							<div class="cell first">
								<p class="font text-left scoreboardText primary">${SL[0].D1}</p>
							</div>
							<div class="cell first">
								<p class="font text-left scoreboardText primary">${SL[1].D1}</p>
							</div>
						</div>`
				} else {
					let disabled = SL[0].D1 == '-' && SL[1].D1 == '-' ? 'none' : ''
					return `<div class="column ${disabled}"
							 data-or="${OR}"
							 data-id="${ID}"
							 data-it="${IT}">
							 
							<div class="cell title">
								<div class="scoreboardIcon ${NA.replace('I','')}"></div>
							</div>
							<div class="cell another">${SL[0].D1}</div>
							<div class="cell another">${SL[1].D1}</div>
						</div>`
				}
			}).join('');
		};

		templateForBasketballStatistic =(es)=> {
			const { SC } = es;
			return ` ${SC.map( item => {
				const { ID, SL, OR, IT, NA } = item;
				if (Number(ID) === 0){
					return `<div class="column"
							data-or="${OR}"
							data-id="${ID}"
							data-it="${IT}">
							<div class="cell title">${NA}</div>
							<div class="cell first">
								<p class="scoreboardBadge second"></p>
								<p class="font text-left scoreboardText primary">${SL[0].D1}</p>
							</div>
							<div class="cell first">
								<p class="scoreboardBadge primary"></p>
								<p class="font text-left scoreboardText primary">${SL[1].D1}</p>
							</div>
						</div>`
				} else {
					return `<div class="column"
							 data-or="${OR}"
							 data-id="${ID}"
							 data-it="${IT}">	 
							<div class="cell title">${NA}</div>
							<div class="cell another">${SL[0].D1}</div>
							<div class="cell another">${SL[1].D1}</div>
						</div> `
				}
			}).join('')}`
		};

		templateForTennisStatictic =(ev)=> {
			const { TG, SS} = ev;
			const { TE, CT, ID, IT } = TG;
			const score = this.getTennisScore(SS);

			let html = '';

			html += `<div class="column"
							data-id="${ID}"
							data-it="${IT}">
						<div class="cell title">${CT}</div>
						<div class="cell first">
							<p class="scoreboardBadge ${TE[0].PI == 1 ? 'second' : 'primary'}"></p>
							<p class="font text-left scoreboardText primary">${TE[0].NA}</p>
						</div>
						<div class="cell first">
							<p class="scoreboardBadge ${TE[1].PI == 1 ? 'second' : 'primary'}"></p>
							<p class="font text-left scoreboardText primary">${TE[1].NA}</p>
						</div>
					</div> `;

			html += score.map((sc,index) => {
				return	`<div class="column"
							 data-id="${ID}"
							 data-it="${IT}">
						<div class="cell title">${index+1}</div>
						<div class="cell another">${sc[0]}</div>
						<div class="cell another">${sc[1]}</div>
					</div>`
			}).join('');

			html += `  <div class="column "
							 data-id="${ID}"
							 data-it="${IT}">
						<div class="cell title yellow">Set</div>
						<div class="cell another yellow">1</div>
						<div class="cell another yellow">1</div>
					</div> 
					<div class="column"
							 data-id="${ID}"
							 data-it="${IT}">
						<div class="cell title">Points</div>
						<div class="cell another">${TE[0].PO}</div>
						<div class="cell another">${TE[1].PO}</div>
					</div>`

			return html
		};

		forScoreboardSoccerTemplate(ev) {
			const { TG, SS, ES } = ev;
			return `
			<div class="scoreboardScreen">
				<div class="font scoreboardHide">Hide</div>
				<div class="scoreboardCount flex-container align-center-middle">
					<p class="font scoreboardCount__item small">${TG.TE[0].NA}</p>
					<p class="font bold scoreboardCount__item big">${SS}</p>
					<p class="font scoreboardCount__item small">${TG.TE[1].NA}</p>
				</div>
				<div class="flex-container align-center-middle scoreboard_table">
					${this.templateForSoccerStatistic(ES)}
				</div>
			</div>`
		}

		forScoreboardTennisTemplate(ev){
			return`
		<div class="scoreboardScreen">
		<div class="font scoreboardHide">Hide</div>
			<div class="flex-container align-center-middle scoreboard_table">
				${this.templateForTennisStatictic(ev)}
			</div>
		</div>`
		}

		forScoreboardBasketballTemplate(ev){
			const { ES } = ev;
			return`
			  <div class="scoreboardScreen">
				  <div class="font scoreboardHide">Hide</div>
				  <div class="flex-container align-center-middle scoreboard_table">				  
				  ${this.templateForBasketballStatistic(ES)}
				</div>		  
			  </div>`
		}

		forScoreboardHockeyTemplate(ev, te){
			return`

		<div class="[ scoreboardScreen ]">
		<div class="font [ scoreboardHide ]">Hide</div>
		<div class="table">
			<div class="table__row title">
				<div class="table__cell"><p class="font text-left scoreboardText primary">11:24</p></div>
				<div class="table__cell"><p class="font scoreboardText primary">1</p></div>
				<div class="table__cell"><p class="font scoreboardText primary">2</p></div>
				<div class="table__cell"><p class="font scoreboardText primary">3</p></div>
				<div class="table__cell"><p class="font scoreboardText primary">T</p></div>
			</div>
			<div class="table__row">
				<div class="table__cell">
					<div class="flex-container align-middle">
						<p class="[ scoreboardBadge primary ]"></p>
						<p class="font text-left scoreboardText primary">Feliciano Lopez</p>
					</div>
				</div>
				<div class="table__cell"><p class="font scoreboardText primary">20</p></div>
				<div class="table__cell"><p class="font scoreboardText primary"></p></div>
				<div class="table__cell"><p class="font scoreboardText primary"></p></div>
				<div class="table__cell"><p class="font scoreboardText second">0</p></div>
			</div>
			<div class="table__row">
				<div class="table__cell">
					<div class="flex-container align-middle">
						<p class="[ scoreboardBadge second ]"></p>
						<p class="font text-left scoreboardText primary">Feliciano Lopez</p>
					</div>
				</div>
				<div class="table__cell"><p class="font scoreboardText primary">11</p></div>
				<div class="table__cell"><p class="font scoreboardText primary"></p></div>
				<div class="table__cell"><p class="font scoreboardText primary"></p></div>
				<div class="table__cell"><p class="font scoreboardText second">0</p></div>
			</div>
		</div>
	</div>
	`

		}

		forScoreboardHandballTemplate(ev, te){
			return`
		<div class="[ scoreboardScreen ]">
		<div class="font [ scoreboardHide ]">Hide</div>
		<div class="table">
			<div class="table__row title">
				<div class="table__cell"></div>
				<div class="table__cell"><p class="font scoreboardText primary ]">1st</p></div>
				<div class="table__cell"><p class="font scoreboardText primary ]">2nd</p></div>
				<div class="table__cell"><p class="font scoreboardText primary ]">Total</p></div>
			</div>
			<div class="table__row">
				<div class="table__cell">
					<div class="flex-container align-middle">
						<p class="[ scoreboardBadge primary ]"></p>
						<p class="font text-left scoreboardText primary">Feliciano Lopez</p>
					</div>
				</div>
				<div class="table__cell"><p class="font scoreboardText primary ]">20</p></div>
				<div class="table__cell"><p class="font scoreboardText primary ]"></p></div>
				<div class="table__cell"><p class="font scoreboardText second ]">0</p></div>
			</div>
			<div class="table__row">
				<div class="table__cell">
					<div class="flex-container align-middle">
						<p class="[ scoreboardBadge second ]"></p>
						<p class="font text-left scoreboardText primary">Feliciano Lopez</p>
					</div>
				</div>
				<div class="table__cell"><p class="font scoreboardText primary ]">11</p></div>
				<div class="table__cell"><p class="font scoreboardText primary ]"></p></div>
				<div class="table__cell"><p class="font scoreboardText second ]">0</p></div>
			</div>
		</div>
	</div>`
		}

		forScoreboardBadmintonTemplate(ev, te){
			return ` 
		\t<div class="scoreboardScreen">
		\t\t<div class="font scoreboardHide">Hide</div>
		\t\t<div class="table">
		\t\t\t<div class="table__row title">
		\t\t\t\t<div class="table__cell"></div>
		\t\t\t\t<div class="table__cell"><p class="font scoreboardText primary">1st</p></div>
		\t\t\t\t<div class="table__cell"><p class="font scoreboardText primary">2nd</p></div>
		\t\t\t\t<div class="table__cell"><p class="font scoreboardText primary">3rd</p></div>
		\t\t\t</div>
		\t\t\t<div class="table__row">
		\t\t\t\t<div class="table__cell">
		\t\t\t\t\t<div class="flex-container align-middle">
		\t\t\t\t\t\t<p class="scoreboardBadge primary"></p>
		\t\t\t\t\t\t<p class="font text-left scoreboardText primary">Feliciano Lopez</p>
		\t\t\t\t\t</div>
		\t\t\t\t</div>
		\t\t\t\t<div class="table__cell"><p class="font  scoreboardText primary">20</p></div>
		\t\t\t\t<div class="table__cell"><p class="font  scoreboardText primary"></p></div>
		\t\t\t\t<div class="table__cell"><p class="font  scoreboardText primary"></p></div>
		\t\t\t</div>
		\t\t\t<div class="table__row">
		\t\t\t\t<div class="table__cell">
		\t\t\t\t\t<div class="flex-container align-middle">
		\t\t\t\t\t\t<p class="scoreboardBadge second "></p>
		\t\t\t\t\t\t<p class="font text-left scoreboardText primary">Feliciano Lopez</p>
		\t\t\t\t\t</div>
		\t\t\t\t</div>
		\t\t\t\t<div class="table__cell"><p class="font scoreboardText primary">11</p></div>
		\t\t\t\t<div class="table__cell"><p class="font scoreboardText primary"></p></div>
		\t\t\t\t<div class="table__cell"><p class="font scoreboardText primary"></p></div>
		\t\t\t</div>
		\t\t</div>
		\t</div>
		</div>`
		}

		forScoreboardBaseballTemplate(ev, te){
			return `
			\t<div class="scoreboardScreen">
			\t\t<div class="font  scoreboardHide ">Hide</div>
			\t\t<div class="table">
			\t\t\t<div class="table__row title">
			\t\t\t\t<div class="table__cell"><p class="font scoreboardText primary text-left ml">Inning 3 BO SO OO</p></div>
			\t\t\t\t<div class="table__cell"><p class="font scoreboardText primary">1</p></div>
			\t\t\t\t<div class="table__cell"><p class="font scoreboardText primary">2</p></div>
			\t\t\t\t<div class="table__cell"><p class="font scoreboardText primary">3</p></div>
			\t\t\t\t<div class="table__cell"><p class="font scoreboardText primary">4</p></div>
			\t\t\t\t<div class="table__cell"><p class="font scoreboardText primary">5</p></div>
			\t\t\t\t<div class="table__cell"><p class="font scoreboardText primary">6</p></div>
			\t\t\t\t<div class="table__cell"><p class="font scoreboardText primary">7</p></div>
			\t\t\t\t<div class="table__cell"><p class="font scoreboardText primary">8</p></div>
			\t\t\t\t<div class="table__cell"><p class="font scoreboardText primary">9</p></div>
			\t\t\t\t<div class="table__cell"><p class="font scoreboardText primary text-uppercase">R</p></div>
			\t\t\t\t<div class="table__cell"><p class="font scoreboardText primary text-uppercase">H</p></div>
			\t\t\t</div>
			\t\t\t<div class="table__row">
			\t\t\t\t<div class="table__cell">
			\t\t\t\t\t<div class="flex-container align-middle">
			\t\t\t\t\t\t<p class="scoreboardBadge primary "></p>
			\t\t\t\t\t\t<p class="font text-left scoreboardText primary">Artyoum Pupkin</p>
			\t\t\t\t\t</div>
			\t\t\t\t</div>
			\t\t\t\t<div class="table__cell"><p class="font scoreboardText primary ">0</p></div>
			\t\t\t\t<div class="table__cell"><p class="font scoreboardText primary ">0</p></div>
			\t\t\t\t<div class="table__cell"><p class="font scoreboardText primary ">0</p></div>
			\t\t\t\t<div class="table__cell"><p class="font scoreboardText primary "></p></div>
			\t\t\t\t<div class="table__cell"><p class="font scoreboardText primary "></p></div>
			\t\t\t\t<div class="table__cell"><p class="font scoreboardText primary "></p></div>
			\t\t\t\t<div class="table__cell"><p class="font scoreboardText primary "></p></div>
			\t\t\t\t<div class="table__cell"><p class="font scoreboardText primary "></p></div>
			\t\t\t\t<div class="table__cell"><p class="font scoreboardText primary "></p></div>
			\t\t\t\t<div class="table__cell"><p class="font scoreboardText second ">0</p></div>
			\t\t\t\t<div class="table__cell"><p class="font scoreboardText primary ">1</p></div>
			\t\t\t</div>
			\t\t\t<div class="table__row">
			\t\t\t\t<div class="table__cell">
			\t\t\t\t\t<div class="flex-container align-middle">
			\t\t\t\t\t\t<p class="scoreboardBadge second"></p>
			\t\t\t\t\t\t<p class="font text-left scoreboardText primary">Feliciano Lopez</p>
			\t\t\t\t\t</div>
			\t\t\t\t</div>
			\t\t\t\t<div class="table__cell"><p class="font scoreboardText primary">0</p></div>
			\t\t\t\t<div class="table__cell"><p class="font scoreboardText primary">0</p></div>
			\t\t\t\t<div class="table__cell"><p class="font scoreboardText primary"></p></div>
			\t\t\t\t<div class="table__cell"><p class="font scoreboardText primary"></p></div>
			\t\t\t\t<div class="table__cell"><p class="font scoreboardText primary"></p></div>
			\t\t\t\t<div class="table__cell"><p class="font scoreboardText primary"></p></div>
			\t\t\t\t<div class="table__cell"><p class="font scoreboardText primary"></p></div>
			\t\t\t\t<div class="table__cell"><p class="font scoreboardText primary"></p></div>
			\t\t\t\t<div class="table__cell"><p class="font scoreboardText primary"></p></div>
			\t\t\t\t<div class="table__cell"><p class="font scoreboardText second ">0</p></div>
			\t\t\t\t<div class="table__cell"><p class="font scoreboardText primary">1</p></div>
			\t\t\t</div>
			\t\t</div>
			\t</div>
			</div>
		`
		}

		forScoreboardBeachVolleyballTemplate(ev, te){
			return `	
			\t<div class="scoreboardScreen">
			\t\t<div class="font scoreboardHide">Hide</div>
			\t\t<div class="table">
			\t\t\t<div class="table__row title">
			\t\t\t\t<div class="table__cell"></div>
			\t\t\t\t<div class="table__cell"><p class="font scoreboardText primary ">1st</p></div>
			\t\t\t\t<div class="table__cell"><p class="font scoreboardText primary ">2nd</p></div>
			\t\t\t\t<div class="table__cell"><p class="font scoreboardText primary ">3rd</p></div>
			\t\t\t</div>
			\t\t\t<div class="table__row">
			\t\t\t\t<div class="table__cell">
			\t\t\t\t\t<div class="flex-container align-middle">
			\t\t\t\t\t\t<p class="scoreboardBadge primary"></p>
			\t\t\t\t\t\t<p class="font text-left scoreboardText primary ">Feliciano Lopez</p>
			\t\t\t\t\t</div>
			\t\t\t\t</div>
			\t\t\t\t<div class="table__cell"><p class="font scoreboardText primary">20</p></div>
			\t\t\t\t<div class="table__cell"><p class="font scoreboardText primary"></p></div>
			\t\t\t\t<div class="table__cell"><p class="font scoreboardText primary"></p></div>
			\t\t\t</div>
			\t\t\t<div class="table__row">
			\t\t\t\t<div class="table__cell">
			\t\t\t\t\t<div class="flex-container align-middle">
			\t\t\t\t\t\t<p class="scoreboardBadge second "></p>
			\t\t\t\t\t\t<p class="font text-left scoreboardText primary ">Feliciano Lopez</p>
			\t\t\t\t\t</div>
			\t\t\t\t</div>
			\t\t\t\t<div class="table__cell"><p class="font scoreboardText primary ">11</p></div>
			\t\t\t\t<div class="table__cell"><p class="font scoreboardText primary "></p></div>
			\t\t\t\t<div class="table__cell"><p class="font scoreboardText primary "></p></div>
			\t\t\t</div>
			\t\t</div>
			\t</div>
			</div>
		`
		}

		forScoreboardCricetTemplate(ev, te){
			return `
				\t<div class="scoreboardScreen">
				\t\t<div class="font scoreboardHide">Hide</div>
				\t\t<div class="table">
				\t\t\t<div class="table__row title">
				\t\t\t\t<div class="table__cell"><p class="font scoreboardText primary text-left ml">Recent Overs...1..4....W.42.</p></div>
				\t\t\t\t<div class="table__cell"></div>
				\t\t\t</div>
				\t\t\t<div class="table__row">
				\t\t\t\t<div class="table__cell">
				\t\t\t\t\t<div class="flex-container align-middle">
				\t\t\t\t\t\t<p class="scoreboardBadge primary"></p>
				\t\t\t\t\t\t<p class="font text-left scoreboardText primary">England</p>
				\t\t\t\t\t</div>
				\t\t\t\t</div>
				\t\t\t\t<div class="table__cell"><p class="font text-nowrap text-right scoreboardText second">475 All Out</p></div>
				\t\t\t</div>
				\t\t\t<div class="table__row">
				\t\t\t\t<div class="table__cell">
				\t\t\t\t\t<div class="flex-container align-middle">
				\t\t\t\t\t\t<p class="scoreboardBadge second"></p>
				\t\t\t\t\t\t<p class="font text-left scoreboardText primary">Australia</p>
				\t\t\t\t\t</div>
				\t\t\t\t</div>
				\t\t\t\t<div class="table__cell"><p class="font text-nowrap text-right scoreboardText second">15/0</p></div>
				\t\t\t</div>
				\t\t</div>
				\t</div>
				</div>
		`
		}

		forScoreboardEsportTemplate(ev,te){
			return `
				\t<div class="scoreboardScreen">
				\t\t<div class="font scoreboardHide">Hide</div>
				\t\t<div class="table">
				\t\t\t<div class="table__row title">
				\t\t\t\t<div class="table__cell">
				\t\t\t\t\t<p class="font scoreboardText primary">Atp Shtutgard</p>
				\t\t\t\t</div>
				\t\t\t</div>
				\t\t\t<div class="table__row">
				\t\t\t\t<div class="table__cell">
				\t\t\t\t\t<div class="flex-container align-center-middle">
				\t\t\t\t\t<p class="font scoreboardText primary mr">Lorem ipsum</p>
				\t\t\t\t\t<p class="font scoreboardText primary ml">Lorem ipsum</p>
				\t\t\t\t\t</div>
				\t\t\t\t</div>
				\t\t\t</div>
				\t\t</div>
				\t</div>
				</div>
		`

		}

		forScoreboardRugbyUnionTemplate(ev, te){
			return `
		\t<div class="scoreboardScreen">
		\t\t<div class="font scoreboardHide">Hide</div>
		\t\t<div class="table">
		\t\t\t<div class="table__row title">
		\t\t\t\t<div class="table__cell"></div>
		\t\t\t\t<div class="table__cell"><p class="font scoreboardText primary">1st</p></div>
		\t\t\t\t<div class="table__cell"><p class="font scoreboardText primary">2nd</p></div>
		\t\t\t\t<div class="table__cell"><p class="font scoreboardText primary">Total</p></div>
		\t\t\t</div>
		\t\t\t<div class="table__row">
		\t\t\t\t<div class="table__cell">
		\t\t\t\t\t<div class="flex-container align-middle">
		\t\t\t\t\t\t<p class="scoreboardBadge primary"></p>
		\t\t\t\t\t\t<p class="font text-left scoreboardText primary">Feliciano Lopez</p>
		\t\t\t\t\t</div>
		\t\t\t\t</div>
		\t\t\t\t<div class="table__cell"><p class="font scoreboardText primary">20</p></div>
		\t\t\t\t<div class="table__cell"><p class="font scoreboardText primary"></p></div>
		\t\t\t\t<div class="table__cell"><p class="font scoreboardText second ">0</p></div>
		\t\t\t</div>
		\t\t\t<div class="table__row">
		\t\t\t\t<div class="table__cell">
		\t\t\t\t\t<div class="flex-container align-middle">
		\t\t\t\t\t\t<p class="scoreboardBadge second"></p>
		\t\t\t\t\t\t<p class="font text-left scoreboardText primary ">Feliciano Lopez</p>
		\t\t\t\t\t</div>
		\t\t\t\t</div>
		\t\t\t\t<div class="table__cell"><p class="font scoreboardText primary ">11</p></div>
		\t\t\t\t<div class="table__cell"><p class="font scoreboardText primary"></p></div>
		\t\t\t\t<div class="table__cell"><p class="font scoreboardText second">0</p></div>
		\t\t\t</div>
		\t\t</div>
		\t</div>
		</div>
		`
		}

		forScoreboardTableTennisTemplate(ev, te){
			return `
		\t<div class="scoreboardScreen">
		\t\t<div class="font scoreboardHide">Hide</div>
		\t\t<div class="table">
		\t\t\t<div class="table__row title">
		\t\t\t\t<div class="table__cell"></div>
		\t\t\t\t<div class="table__cell"><p class="font scoreboardText primary">1</p></div>
		\t\t\t\t<div class="table__cell"><p class="font scoreboardText primary">2</p></div>
		\t\t\t\t<div class="table__cell"><p class="font scoreboardText primary">3</p></div>
		\t\t\t\t<div class="table__cell"><p class="font scoreboardText primary">4</p></div>
		\t\t\t\t<div class="table__cell"><p class="font scoreboardText primary">5</p></div>
		\t\t\t</div>
		\t\t\t<div class="table__row">
		\t\t\t\t<div class="table__cell">
		\t\t\t\t\t<div class="flex-container align-middle">
		\t\t\t\t\t\t<p class="scoreboardBadge primary"></p>
		\t\t\t\t\t\t<p class="font text-left scoreboardText primary">Artyoum Pupkin</p>
		\t\t\t\t\t</div>
		\t\t\t\t</div>
		\t\t\t\t<div class="table__cell"><p class="font scoreboardText primary">20</p></div>
		\t\t\t\t<div class="table__cell"><p class="font scoreboardText primary">12</p></div>
		\t\t\t\t<div class="table__cell"><p class="font scoreboardText primary">0</p></div>
		\t\t\t\t<div class="table__cell"><p class="font scoreboardText primary">12</p></div>
		\t\t\t\t<div class="table__cell"><p class="font scoreboardText primary">0</p></div>
		\t\t\t</div>
		\t\t\t<div class="table__row">
		\t\t\t\t<div class="table__cell">
		\t\t\t\t\t<div class="flex-container align-middle">
		\t\t\t\t\t\t<p class="scoreboardBadge second"></p>
		\t\t\t\t\t\t<p class="font text-left scoreboardText primary">Feliciano Lopez</p>
		\t\t\t\t\t</div>
		\t\t\t\t</div>
		\t\t\t\t<div class="table__cell"><p class="font scoreboardText primary">11</p></div>
		\t\t\t\t<div class="table__cell"><p class="font scoreboardText primary"></p></div>
		\t\t\t\t<div class="table__cell"><p class="font scoreboardText primary">0</p></div>
		\t\t\t\t<div class="table__cell"><p class="font scoreboardText primary">12</p></div>
		\t\t\t\t<div class="table__cell"><p class="font scoreboardText primary">0</p></div>
		\t\t\t</div>
		\t\t</div>
		\t</div>
		</div>
		`
		}

		forScoreboardVolleyballTemplate(ev, te){
			return `
			\t<div class="scoreboardScreen">
			\t\t<div class="font scoreboardHide">Hide</div>
			\t\t<div class="table">
			\t\t\t<div class="table__row title">
			\t\t\t\t<div class="table__cell"></div>
			\t\t\t\t<div class="table__cell"><p class="font scoreboardText primary">1st</p></div>
			\t\t\t\t<div class="table__cell"><p class="font scoreboardText primary">2nd</p></div>
			\t\t\t\t<div class="table__cell"><p class="font scoreboardText primary">3rd</p></div>
			\t\t\t\t<div class="table__cell"><p class="font scoreboardText primary">4th</p></div>
			\t\t\t\t<div class="table__cell"><p class="font scoreboardText primary">5th</p></div>
			\t\t\t</div>
			\t\t\t<div class="table__row">
			\t\t\t\t<div class="table__cell">
			\t\t\t\t\t<div class="flex-container align-middle">
			\t\t\t\t\t\t<p class="scoreboardBadge primary"></p>
			\t\t\t\t\t\t<p class="font text-left scoreboardText primary">Artyoum Pupkin</p>
			\t\t\t\t\t</div>
			\t\t\t\t</div>
			\t\t\t\t<div class="table__cell"><p class="font scoreboardText primary">10</p></div>
			\t\t\t\t<div class="table__cell"><p class="font scoreboardText primary">20</p></div>
			\t\t\t\t<div class="table__cell"><p class="font scoreboardText primary">10</p></div>
			\t\t\t\t<div class="table__cell"><p class="font scoreboardText primary">10</p></div>
			\t\t\t\t<div class="table__cell"><p class="font scoreboardText primary"></p></div>
			\t\t\t</div>
			\t\t\t<div class="table__row">
			\t\t\t\t<div class="table__cell">
			\t\t\t\t\t<div class="flex-container align-middle">
			\t\t\t\t\t\t<p class="scoreboardBadge second"></p>
			\t\t\t\t\t\t<p class="font text-left scoreboardText primary">Feliciano Lopez</p>
			\t\t\t\t\t</div>
			\t\t\t\t</div>
			\t\t\t\t<div class="table__cell"><p class="font scoreboardText primary ">10</p></div>
			\t\t\t\t<div class="table__cell"><p class="font scoreboardText primary ">20</p></div>
			\t\t\t\t<div class="table__cell"><p class="font scoreboardText primary ">10</p></div>
			\t\t\t\t<div class="table__cell"><p class="font scoreboardText primary ">10</p></div>
			\t\t\t\t<div class="table__cell"><p class="font scoreboardText primary "></p></div>
			\t\t\t</div>
			\t\t</div>
			\t</div>
			</div>
		`
		}

		getTennisScore =(str)=> {
			const res = str.split(',');
			const score = res.length > 1 ? res.map(s => s.split('-')) : [res[0].split('-')];
			return score

		};

		eventIcon =(id)=> {
			if (Number(id) === 2) return 'Goal'
			if (Number(id) === 7) return 'Corner'
			if (Number(id) === 4) return 'YellowCard'
			if (Number(id) === 5) return 'RedCard'
			if (Number(id) === 1) return 'Break'
			if (Number(id) === 0) return 'None'
			if (id === '') return 'Penalty'
		};

		drawData =(ev)=> {
			console.log(ev)
			let current;

			if (Number(ev.CL) === 1){
				current = this.forScoreboardSoccerTemplate(ev);
			}
			if (Number(ev.CL) === 13){
				current = this.forScoreboardTennisTemplate(ev);
			}
			if (Number(ev.CL) === 18){
				current = this.forScoreboardBasketballTemplate(ev);
			}
			if (Number(ev.CL) === 78){
				current = this.forScoreboardHandballTemplate(ev)
			}
			if (Number(ev.CL) === 17){
				current = this.forScoreboardHockeyTemplate(ev)
			}


			return this.defaultScoreboard(current || this.forScoreboardBaseballTemplate(ev), ev);
		}

		doStuff(){
			const show_board_menu = document.getElementById('show_board_menu');
			document.querySelector('.scoreboardToggle').classList.toggle('none');
			document.querySelector('.scoreboardToggle').classList.toggle('block');

			if (show_board_menu.hasAttribute('style')){
				show_board_menu.removeAttribute('style')
			} else {
				show_board_menu.style.transform = 'rotate(-180deg)'
			}

		}

		hideScreen(){
			const screen = document.querySelector('.scoreboardScreen');
			const show_btn = document.querySelector('.scoreboardShow');
			screen.classList.add('hide_screen');
			show_btn.classList.add('show_btn');
		}

		showScreen(e){
			const screen = document.querySelector('.scoreboardScreen');
			screen.classList.remove('hide_screen');
			e.target.classList.remove('show_btn');
		}

		timer(etu, etm, ets){
			etu = etu.toString();
			etm = etm.toString();
			ets = ets.toString();
			let years = etu.substring(0,4);
			let month = etu.substring(4,6);
			let day = etu.substring(6,8);
			let hours = etu.substring (8,10);
			let minute = etu.substring(10,12);
			let second = etu.substring(12,14);
			let date = years+'-'+month+'-'+day+' '+hours+':'+minute+':'+second;
			let ts = new Date(date).getTime()/1000;
			let tn = new Date().getTime()/1000;
			let offset = new Date().getTimezoneOffset();
			let dt = Math.floor(tn - ts + etm*60 + ets - Math.abs(offset)*60);
			let min = Math.floor(dt / 60);
			let sec = dt - min * 60;
			if (min<10) min = '0'+min;
			if (sec<10) sec = '0'+sec;
			let timer = min+':'+sec;
			return timer;
		}

		showTime(data,elem){
			this.timerId = setInterval(()=> {
				if (data.TT != 0){
					let time = this.timer(data.TU, data.TM, data.TS);
					elem.innerText = `${this.partOfMatch(data)} ${time}`;
				} else {
					clearInterval(this.timerId);
					this.checkTime(data);
				}
			},1000);
		}

		partOfMatch(data){
			let half = '';
			if (data.TM >= 45 && data.MD==1) {
				return half = '2nd Half';
			}
			if (data.TM >=90 && data.MD==2){
				return half = '1st Extra Time';
			}
			if (data.TM >=105 && data.MD==3){
				return half = '2nd Extra Time';
			}
			if ( data.TM>=120 && data.MD==4) {
				return half = 'Penalty'
			} else {
				return half = '1st Half';
			}

			return half;
		}

		checkTime(data){
			const elem = document.getElementById('match_time')

			if (data.TT != 0){
				if (data.DC == 1){
					this.showTime(data,elem)
					return
				}
				if (data.TM==0 && data.TT==0 && data.TS==0 && data.MD==0){
					elem.innerText = '1st Half 00:00'
				}
				if (data.TT==0 && data.TM==45 && data.MD==1) {
					elem.innerText = 'Half Time 45:00'
				}
				if (data.TT==0 && data.TM==90 && data.TS==0 && data.MD==1) {
					elem.innerText = 'Match End'
				}
				if (data.TT==0 && data.TM==90 && data.TS==0 && data.MD==2) {
					elem.innerText = '1st Extra Time 90:00'
				}
				if (data.TT==0 && data.TM==105 && data.TS==0 && data.MD==3){
					elem.innerText = 'Half Extra Time 105:00'
				}
				if (data.TT==0 && data.TM==120 && data.TS==0 && data.MD==3){
					elem.innerText = 'Match End'
				}
				if (data.TT==0 && data.TM==120 && data.TS==0 && data.MD==4) {
					elem.innerText = 'Penalty'
				}
			}
			return ''
		};

		clearCurrentTimer =()=> {
			const hash = window.location.hash.includes('inplay');
			const hash2 = window.location.hash.includes('event');

			if (!hash || !hash2) {
				clearInterval(this.timerId)
				window.removeEventListener('hashchange', this.clearCurrentTimer)
			}
		}
	};

window.scoreboard = new Scoreboard();
window.addEventListener('hashchange', scoreboard.clearCurrentTimer);








