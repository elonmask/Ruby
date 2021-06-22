ld.loadSingleModule('./modules', 'slider', '#inplay_slider')
    .then(res => {
        window.playTable = new Overview();
        playTable.loadData();
        window.addEventListener('hashchange', playTable.clearTimer);
    });

window.Overview = class PlayTable {
    constructor() {
        this.link = "http://bestline.bet/api/?key=inplay";
        this.menu = 'MB';
        this.container = '';
        this.date;
        this.activeCL = localStorage.getItem('sport') ? localStorage.getItem('sport') : 'Soccer';
        this.activeLinkId = JSON.parse(localStorage.getItem('sportId', this.activeLinkId)) || 1;
        this.activeLeftMatchMenu = 'MB';
        this.links = [];
        this.matchNodes = [];
        this.intervalId = '';
        this.stakesFP = [];
        this.qbCupon = null;
    }

    forSliderTemplate = (data) => {
        const { NA, ID, IT } = data;
        return `<a class="slider__item ${this.activeCL === NA ? 'active' : ''}" 
					data-name="${NA}"
					data-id="${ID}"
					data-it="${IT}">
				<p class="sports-${NA.replace(' ', '-').toLowerCase()} icon"></p>
				<p class="font ellipsis text">${NA}</p>
			</a>`;
    };

    inplayCategoryTemplate = (name) => {
        let div = document.createElement('div');
        div.className = 'inplayCategory';
        div.innerHTML = `
				<div class="flex-container align-middle">
					<p class="sports-${name.replace(' ', '-').toLowerCase()}"></p>
					<p class="font primary ml text-transform">${name}:</p>
				</div>
				<div class="flex-container align-middle inplayMenu">
					<button class="font text-uppercase inplayMenu__item border" 
					    data-lang="main_bets"
					    data-menu="MB">Main Bets</button>
					<button class="font text-uppercase inplayMenu__item border" 
					    data-lang="number_of_goals"
					    data-menu="NOG">Number of goals</button>
					<button class="font text-uppercase inplayMenu__item border" 
					    data-lang="next_goal"
					    data-menu="NG">Next goal</button>
				</div>`

        div.querySelectorAll('button').forEach(bt => {
            bt.addEventListener('click', this.rightMatchMenu)
        });

        return div;
    };

    inplaySubCategoryTemplate = (it, name, key) => {
        const template = document.createElement('template');
        template.innerHTML = `<div class="inplaySubcategory open" 
                                       data-it="${it}" 
                                       data-name="${name}"
                                       data-key="${key}">
				<img src="./img/icon-country/Ukraine.ico" class="icon">
				<p class="font">${name ? name : ''}</p>	
			</div>`;

        template.content.querySelector('.inplaySubcategory').addEventListener('click', this.ShHdPlayTableItem);

        return template.content;
    };

    timeTemplate = (half, timer, data) => {
        return `
			<div class="inplayTeamTime" data-tt="${data.TT}" data-tu="${data.TU}" data-tm="${data.TM}" data-ts="${data.TS}">
				<p class="font team-period">${half}</p>
				<p class="font bold team-time">${timer}</p>
			</div>`;
    };

    optionsTemplate = (play) => {
        return `<div class="flex-container align-center-middle inplayTeamOptions">
				<button class="sport-icon ${play.toLowerCase()} team-button"></button>
				<button class="sport-icon play team-button"></button>
			</div>`;
    };

    forPeriodTemplate = (data, play) => {
        const { NA, FI, ID, SS } = data;

        const ssArr = SS ? SS.split('-') : [0, 0];
        const commands = getCommands(NA);

        return `${this.checkTime(data)}
				<a href='#/inplay/event/${ID}' class="flex-container align-justify align-middle inplayTeamScoreInfo"
				   data-fi="${FI}" 
				   data-id="${ID}"
				   href="#/event/">
				   <div style="width: 75%">
				   		<p class="font ellipsis text-left team-name">${commands[0]}</p>
						<p class="font ellipsis text-left team-name">${commands[1]}</p>
					</div>
					<div style="width: 20%">
						<p class="font text-center team-score">${ssArr[0]}</p>
						<p class="font text-center team-score">${ssArr[1]}</p>
					</div>
			 	</a>
			${this.optionsTemplate(play)}`;
    };

    forSetTemplate = (data, play) => {
        let { SS, PI, XP, NA, ID } = data;

        const players = getCommands(NA);
        const set = getSetScore(SS);
        const score = this.checkMatchScore(SS, XP);
        SS = score[0];
        XP = score[1];

        const pi = PI ? PI.split(',') : [0, 0];
        const xp = XP ? XP.split('-') : [0, 0];

        let html = '';
        html = `<div class="inplayTeamTime">
				<div class="text-center">
					<p class="font team-period">${set.length} Set</p>
				</div>
			</div>
			<a href="#/inplay/event/${ID}" class="inplayTeamScoreInfo" 
			   data-fi="${data.FI}" 
			   data-id="${data.ID}"
			   href="#/event/">
				<p class="font ellipsis text-left team-name">${players[0]}</p>
				<p class="font ellipsis text-left team-name">${players[1]}</p>
			</a>
			<table class="inplayTeamScoreTableInfo">
				<tr>
					<td> ${pi[0] == 1 ? '<div class="circle"></div>' : ''} </td> 
					${set.map(str => `<td><p class="font primary">${str[0]}</p></td>`).join('')}
					<td><p class="font">${xp[0] ? xp[0] : ''}</p></td>
				</tr>
				<tr>
					<td> ${pi[1] == 1 ? '<div class="circle"></div>' : ''} </td> 
					${set.map(str => `<td><p class="font primary">${str[1]}</p></td>`).join('')}
					<td><p class="font">${xp[1] ? xp[1] : ''}</p></td>		
				</tr>
			</table>
			${this.optionsTemplate(play)}
		`

        return html
    };

    checkMatchScore = (SS, XP) => {
        let SSold = SS;
        let XPold = XP;

        if (this.activeLinkId === 91 || this.activeLinkId === 92) {
            return [SS = XPold, XP = SSold];
        }

        return [SS, XP]
    };

    numberOfGoals = () => {
        const html = `<div class="number-of-goals inplay-right_menu ${(this.menu == 'NOG') ? 'active' : ''}" data-menu-wrap="NOG">
					<p class="font white">Number Of Goals</p>
				</div>`;
        return html;
    }

    nextGoal = () => {
        const html = `<div class="next-goal inplay-right_menu${(this.menu == 'NG') ? 'active' : ''}" data-menu-wrap="NG">
					<p class="font white">Next Goal</p>
				</div>`;
        return html;
    };

    mainBets = (ev) => {
        const { markets, LM } = ev;
        const { [0]: data } = markets;

        let html = '';

        if (data) {
            let suBlock,
                suButton;

            suBlock = (data.SU == 1) ? 'disabled' : '';
            html += `<div class="main-bets inplay-right_menu ${suBlock} ${(this.menu == 'MB') ? 'active' : ''}" 
					data-it="${data.IT}" 
					data-menu-wrap="MB">

					<div class="flex-container align-middle">
						<p class="font white ml">${data.NA}</p>
					</div>
					<div class="flex-container align-middle">
						<button class="button reload reload--left">
							<i class="fa fa-angle-left"></i>
						</button>
						<div class="flex-container align-middle inplayTeamButtons">`;

            data.coef.map(item => {
                const { IT, SU, NA, OD, LM, FI, BS, ID, FF } = item;
                if (FF) {
                    console.log(FF)
                }
                suButton = (item.SU == 1) ? 'disabled' : '';
                html += `<button 
                                class="button coefficient coef_item ${this.markActiveStake(ID)} ${suButton}" 
                                data-it="${IT}" 
                                data-fi="${FI}"
                                data-bs="${BS}"
                                data-id="${ID}" 
                                data-od="${OD}"
                                data-sport-id="${this.activeLinkId}">`;
                if (SU == 0) {
                    html += `<p class="font ellipsis mra">${NA}</p>
								 <p class="font down blick">${transformBet(OD)}</p>`;
                } else {
                    html += `<p class="font ellipsis mra">${NA}</p>
								 <span class="fa fa-lock lock"></span>`;
                }
                html += `</button>`
            });

            html += `</div>
						<button class="button reload reload--right">
							<i class="fa fa-angle-right"></i>
						</button>
						<a class="button coefficient last inplayLM" data-fi="${data.FI}" href="#/inplay/event">
							<p class="font ellipsis">+${LM}</p> 
						</a>
					</div>
				</div>`;
        }
        return html;
    };

    resultsInplayTemplate = (data, play, key) => {
        const div = document.createElement('div');
        div.className = `flex-container align-middle inplayTable ${play.toLowerCase()}`;
        div.id = `${data.IT}`;
        div.setAttribute('data-key', key)

        let html = `<div class="flex-container align-middle inplayTable__left">`;

        switch (play) {
            case "Soccer":
                html += this.forPeriodTemplate(data, play);
                break;
            case "Tennis":
                html += this.forSetTemplate(data, play);
                break;
            case "Table Tennis":
                html += this.forSetTemplate(data, play);
                break;
            case "Badminton":
                html += this.forSetTemplate(data, play);
                break;
            case "Volleyball":
                html += this.forSetTemplate(data, play);
                break;
            case "Beach Volleyball":
                html += this.forSetTemplate(data, play);
                break;
            case "Cricket":
                html += this.forSetTemplate(data, play);
                break;
            default:
                html += this.forPeriodTemplate(data, play);
        }


        html += `</div>
					<div class="inplayTable__right">
						${this.mainBets(data)}
						${this.numberOfGoals()}
						${this.nextGoal()}
					</div>
				`;

        div.innerHTML = html;

        div.querySelectorAll('.coef_item').forEach(el => {
            el.addEventListener('click', this.buttonData);
        });

        this.matchNodes.push(div);
        return div;
    };

    ShHdPlayTableItem = (e) => {
        const el = e.target;
        const prnt = el.closest('.inplaySubcategory');
        prnt.classList.toggle('closed');
        prnt.classList.toggle('open');
        const dtKey = prnt.dataset.key;

        this.matchNodes.map(div => {
            if (div.dataset.key === dtKey) {
                div.classList.toggle('hide')
            }
        });

    };

    checkTime = (data) => {
        let time = '';
        let half = '';

        if (data.DC == 1) {
            if (data.TT == 1 || data.TM > 0) {
                time = timer(data.TU, data.TM, data.TS);
            } else
                time = '00:00';

            if (data.TM >= 45)
                half = '2nd Half';
            else
                half = '1st Half';

            if (data.TM == 45 && data.TT == 0) {
                half = 'Half Time';
                time = '45:00'
            }

            if (data.TT == 0 && data.TU == '') {
                half = '1st Half';
                time = timerTT(data.TM, data.TS);
            }
        }
        return this.timeTemplate(half, time, data);
    };


    timerON = () => {
        this.matchNodes.map(obj => {
            const matchTimeParentNode = obj.querySelector('.inplayTeamTime');
            const matchTimeNode = matchTimeParentNode.querySelector('.team-time');

            const TU = matchTimeParentNode.dataset.tu;
            const TT = matchTimeParentNode.dataset.tt;
            const TM = matchTimeParentNode.dataset.tm;
            const TS = matchTimeParentNode.dataset.ts;

            if (TT == 1) {
                return matchTimeNode.innerText = timer(TU, TM, TS)
            }

            if (TT == 0) {
                return matchTimeNode.innerText = timerTT(TM, TS)
            }
        });
    };

    showCurrentLinkPage = (e) => {
        const a = e.target.closest('.slider__item');
        this.activeCL = a.dataset.name;
        this.activeLinkId = Number(a.dataset.id);

        localStorage.setItem('sport', this.activeCL);
        localStorage.setItem('sportId', this.activeLinkId);

        this.container.innerHTML = '';
        this.drawData();
        this.activeLink(a)
    };

    rightMatchMenu = (e) => {
        this.activeLeftMatchMenu = e.target.dataset.menu;
        this.matchNodes.map(match => {
            match.querySelectorAll('.inplay-right_menu').forEach(e => {
                if (e.dataset.menuWrap === this.activeLeftMatchMenu) {
                    e.classList.add('active')
                } else {
                    e.classList.remove('active')
                }
            })
        });
    };

    activeLink = (a) => {
        this.links.map(a => a.classList.remove('active'))
        a.classList.add('active');
    };

    loadData = () => {
        loader.loaderOn();
        fetch(`${this.link}`)
            .then(res => res.json())
            .then(res => {
                this.date = res;
                this.setData(res)
            })
            .then(res => loader.loaderOff())
            .catch(err => console.log('overview', err))
    };

    setData = () => {
        this.initSlider();
        const data = transformInplayData(this.date);
        this.transformData(data);
    };

    transformData = (data) => {
        Object.keys(data).forEach(key => {
            this[key] = data[key]
        });
        this.drawData();
    };

    initSlider = () => {
        const sliderContainer = document.getElementById('inplay_slider');
        const sliderTrack = sliderContainer.querySelector('.slider__track');

        this.date.map(item => {
            if (item.type === 'CL') {
                if (item.ID != 75 && item.ID != 4 && item.ID != 24) {
                    sliderTrack.innerHTML += this.forSliderTemplate(item);

                    sliderTrack.querySelectorAll('.slider__item').forEach(a => {
                        this.links.push(a);
                        a.addEventListener('click', this.showCurrentLinkPage);
                    });
                }
            }

        });

        slider.init(sliderTrack);
    };

    drawData = () => {
        this.container = document.getElementById('inplay_container');
        const { NA, IT, ID, ligues } = this[this.activeCL];
        this.lightStakeButton();

        this.container.appendChild(this.inplayCategoryTemplate(NA, IT, ID));
        this.matchNodes = [];

        ligues.map((ct, index) => {
            this.container.appendChild(this.inplaySubCategoryTemplate(ct.IT, ct.NA, index));
            ct.events.map(ev => {
                this.container.appendChild(this.resultsInplayTemplate(ev, NA, index));
            });
        });

        this.intervalId = setInterval(this.timerON, 1000);
        changeLanguage()
    };

    lightStakeButton = () => {
        const data = JSON.parse(sessionStorage.getItem('bt'));
        if (data && data.ns) {
            const reg = /(\bfp=)(\d+)/g;
            data.ns.split('||').map(str => {
                if (str) {
                    const word = str.match(reg);
                    this.stakesFP.push(word[0].replace('fp=', ''))
                }
            });
        } else {
            this.stakesFP = [];
        }
    };

    markActiveStake = (stId) => {
        let stClass = '';
        this.stakesFP.map(id => {
            if (stId === id) {
                return stClass = 'on';
            }
        });

        return stClass
    };

    buttonData = (e) => {
        const prnt = e.target.closest('.coef_item');
        qbC.buttonData(prnt, e);
        console.log("Clicked bet")
    };

    clearTimer = () => {
        const hash = window.location.hash.includes('inplay');
        const hash2 = window.location.hash.includes('playTable');

        if (!hash || !hash2) {
            clearInterval(this.intervalId)
            window.removeEventListener('hashchange', this.clearTimer)
        }
    };

    decToHex = (n) => Number(n).toString(16);

    hexToDec = (hex) => parseInt(hex, 16)
};

