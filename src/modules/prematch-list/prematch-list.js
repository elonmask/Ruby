window.PrematchList = class PrematchList {
    constructor() {
        this.data;
        this.container;
        this.list;
        this.header;
        this.date = 0;
        this.elInd = [];
    }

    socTenEventInfo = (arr) => {
        const div = document.createElement('div');
        div.className = 'prematch-column first font white flex-container flex-dir-column';
        div.innerHTML = `
                ${arr.PA.map((el, index) => {
            const { NA, N2, BC, PD } = el;
            const codPD = encodeURL(PD);
            const date = transformDay(BC)
            return ` 
                            ${this.checkTime(date[1], index)}
                            <div class="prematch-column-item flex-container">
                                <div class="item-time">${date[0]}</div>
                                <div class="item-name flex-container">
                                    <a href="./#/sports/table/${codPD}" class="item-name-first">
                                        <p class="participant">${NA}</p>
                                    </a>
                                    <div>vs</div>
                                    <a href="./#/sports/table/${codPD}" class="item-name-second">
                                        <p class="participant">${N2}</p>
                                    </a>
                                </div>
                            </div>
                    `
        }).join('')}`
        //console.log();
        return div
    };

    socTenOtherBets = (arr) => {
        const div = document.createElement('div');
        div.className = 'prematch-column last font white flex-container flex-dir-column';
        div.innerHTML = `${arr.PA.map((ev, index) => {
            const { MR, PD } = ev;
            const code = encodeURL(PD);
            const ch = this.pasteItemHeader(index);
            return ` 
                                    ${ch ? this.headerForBets() : ''} 
                                    <button class="coef_item">
                                        <a class="other-bt-link" href="./#/sports/table/${code}">+${MR || 0}</a>
                                    </button>`;
        }).join('')}`;
        return div
    };

    baskHocEventInfo = (arr) => {
        const div = document.createElement('div');
        div.className = 'prematch-column first font white flex-container flex-dir-column';
        div.innerHTML = `
                ${arr.PA.map((el, index) => {
            if (!el.NA && !el.NA) {
                return
            }

            const { NA, N2, BC, TM, D1, PD } = el;
            const date = transformDay(BC);
            const codePD = encodeURL(PD);
            return ` 
                            ${this.checkTime(date[1], index)}
                            <div class="prematch-column-item ${TM ? 'three' : 'basketball'} flex-container">
                                <div class="item-time">${date[0]}
                                </div>
                                <div class="item-name flex-container flex-dir-column align-center">
                                    <a href="./#/sports/table/${codePD}" class="item-name-first">
                                        ${D1 ? `<span>${(D1.split(',')[0])}</span>` : ''}
                                        <p class="participant">${NA}</p>
                                    </a>
                                    <a href="./#/sports/table/${codePD}" class="item-name-second">
                                        ${D1 ? `<span>${D1.split(',')[1]}</span>` : ''}
                                        <p class="participant">${N2}</p>
                                    </a>
                                    ${TM ? `<div class="item-name-third">${TM}</div>` : ''}
                                </div>
                            </div>
                            `
        }).join('')}`
        return div
    };

    baskHocOtherBets = (arr) => {
        const div = document.createElement('div');
        div.className = 'prematch-column last font white flex-container flex-dir-column';
        div.innerHTML = `${arr.PA.map((ev, index) => {
            if (!ev.NA) return
            const { MR, TM, PD } = ev;
            const code = encodeURL(PD);
            const ch = this.pasteItemHeader(index);
            return ` 
                    ${ch ? this.headerForBets() : ''} 
                    <button class="coef_item ${TM ? 'three' : 'basketball'}">
                        <a class="other-bt-link" href="./#/sports/table/${code}">+${MR}</a>         
                    </button>`;
        }).join('')}`;
        return div
    };

    eventBets = (arr) => {
        const colNm = arr.NA || ''
        const div = document.createElement('div');
        div.className = 'prematch-column font white flex-container flex-dir-column';
        div.innerHTML = `${arr.PA.map((it, index) => {
            const { OD, HD, SU, ID, IT, FI } = it;
            const activeClass = this.buttonSUClass(SU);
            console.log(OD);
            const ch = this.pasteItemHeader(index);
            return `${ch ? this.headerForBets(colNm) : ''} 
                    <button class="${activeClass} bet" 
                            data-id="${ID}" 
                            data-it="${IT}" 
                            data-fi="${FI}">
                        ${transformBet(OD)}
                        ${HD ? `<span class="nd">${HD}</span>` : ''}
                    </button>`
        }).join('')}`;

        div.querySelectorAll('.coef_item').forEach(btn => btn.addEventListener('click', this.makeStakeReq))
        return div
    };

    playerHeadersTemplate = (obj) => {
        const { NA, BC } = obj;
        const date = transformDay(BC);
        const div = document.createElement('div');
        div.className = 'flex-container align-justify ev-HD';
        div.innerHTML = `
            <span class="ev-nM">${NA}</span>    
            <span class="ev-dT">${new Date(date[1]).toDateString()} ${date[0]}</span>    
        `

        return div
    };

    playerBetsTemplate = (obj) => {
        const { PA } = obj;
        const div = document.createElement('div');
        div.className = 'flex-container flex-dir-row';

        PA.forEach(it => {
            const { OD, NA, ID, IT, FI } = it;

            const bet = transformBet(OD);
            const inDiv = document.createElement('div');
            inDiv.className = 'coef_item pl flex-container align-justify align-middle';
            inDiv.setAttribute('data-id', ID);
            inDiv.setAttribute('data-it', IT);
            inDiv.setAttribute('data-fi', FI);
            inDiv.innerHTML = `<span class="nm">${NA}</span> ${bet}`
            inDiv.addEventListener('click', this.makeStakeReq)
            div.appendChild(inDiv)
        });

        return div
    };

    dateHeader = () => {
        return `
                <div class="prematch-date-header flex-container align-center">
                   <span>${new Date(this.date).toDateString()}</span>    
                </div>
        `
    };

    headerForBets = (nm) => {
        return ` 
              <div class="prematch-date-header flex-container align-center">${nm || ''}</div>
        `
    };

    buttonSUClass = (su) => {
        switch (su) {
            case '1':
                return 'suspended'
            case '2':
                return 'otb'
            default:
                return 'coef_item'
        }
    };

    createContainer = () => {
        this.evBl = document.createElement('div');
        this.evBl.className = 'prematch-events-block flex-container';

        this.elInd = [];
        this.date = 0;
    };

    createContainerColumn = () => {
        this.evBl = document.createElement('div');
        this.evBl.className = 'prematch-events-block flex-container flex-dir-column'
    };

    loadData = (id) => {
        fetch(`http://bestline.bet/sports/?PD=${id}`)
            .then(res => res.json())
            .then(res => this.transformData(res))
            .then(res => qbC.searchActiveButton())
            .then(res => loader.loaderOff())
            .catch(err => console.log(err))
    };

    transformData = (data) => {
        const obj = {};
        obj.MG = [];
        obj.MA = [];
        let MA;

        data.map(it => {
            if (it.type === 'CL') {
                obj.CL = it
            }
            if (it.type === 'EV') {
                obj.EV = it
            }
            if (it.type === 'MG') {
                obj.MG.push(it)
            }
            if (it.type === 'MA') {
                MA = it;
                MA.PA = [];
                obj.MA.push(MA)
            }
            if (it.type === 'PA') {
                MA.PA.push(it)
            }
        });

        obj.MA = obj.MA.filter(item => item.ID && item.SY !== 'cp' ? item : null);

        this.data = obj;
        if (obj.CL.ID === '1' || obj.CL.ID === '13' || obj.CL.ID === '91') {
            this.drawSocTenData()
        }
        if (obj.CL.ID === '18' || obj.CL.ID === '17') {
            this.drawBaskHockData()
        }
    };

    drawSocTenData = () => {
        const { MA, EV } = this.data;
        const ligueNm = transformCMN(EV.TB);
        this.header.innerText = ligueNm[0] && ligueNm[1] ? `${ligueNm[0]}/ ${ligueNm[1]}` : 'Sport';

        MA.map((item, index) => {

            if (item.SY === 'ccd') {
                this.createContainer();
                this.evBl.appendChild(this.socTenEventInfo(item));
                this.evBl.appendChild(this.socTenOtherBets(item));
                return
            }
            if (item.SY === 'ccf' || item.SY === 'cce') {
                this.evBl.appendChild(this.eventBets(item));
                this.list.appendChild(this.evBl)
            }
            if (item.SY === 'cx') {
                this.createContainer();
                this.evBl.appendChild(this.playerBetsTemplate(item));

                this.list.appendChild(this.playerHeadersTemplate(item));
                this.list.appendChild(this.evBl)
            }
        })
    };

    drawBaskHockData = () => {
        const { MA, EV } = this.data;
        const ligueNm = transformCMN(EV.TB);
        this.header.innerText = `${ligueNm[0]}/ ${ligueNm[1]}` || 'Sport';

        MA.map((item, index) => {
            const { SY } = item;
            if (index === 0 && SY === 'ccl') {
                this.createContainer();
                this.evBl.appendChild(this.baskHocEventInfo(item));
                this.evBl.appendChild(this.baskHocOtherBets(item));
                return
            }
            if (SY === 'cci' || SY === 'ccj') {
                this.evBl.appendChild(this.eventBets(item));
                this.list.appendChild(this.evBl);
            }

            if (SY === 'cw') {
                this.createContainerColumn();
                this.evBl.appendChild(this.playerHeadersTemplate(item))
            }

            if (SY === 'cam') {
                this.evBl.appendChild(this.playerBetsTemplate(item));
                this.list.appendChild(this.evBl)
            }

        })
    };

    init = () => {
        loader.loaderOn()
        this.container = document.getElementById('prematch-list');
        this.list = this.container.querySelector('.prematch-list-container');
        this.header = this.container.querySelector('.prematch-list-header');

        const id = this.getMatchId();
        this.loadData(id);
    };

    /////

    makeStakeReq = (e) => {
        const elem = e.target.closest('.coef_item');
        qbC.buttonData(elem, e)
    };

    getMatchId = () => {
        const hash = window.location.hash;
        const id = hash.split('/');
        return id[2]
    };

    backToMainPage = () => {
        window.location = '/#/sports/'
    };

    checkTime = (date, index) => {
        if (this.date < date) {
            this.date = date;
            this.elInd.push(index);
            return this.dateHeader()
        }
        this.date = date;
        return ''
    };

    pasteItemHeader = (index) => {
        return this.elInd.some(it => index === it)
    };
};

window.prematchList = new PrematchList();
prematchList.init();