window.HighlightsBets = class HighlightsBets {
    constructor(){
        this.wrapper;
        this.container;
        this.sportID = localStorage.getItem('spId-sports') || '1';
        this.data = {};
        this.links = [];
        this.events_time;
        this.evDate;
        this.evIndexArr;
    }

    containerHeader =(data)=> {
        return `
            <div class="highlights-cell-title">
                <div class="flex-container align-center-middle">
                    <p class="font white ellipsis" style="line-height: 20px;">${data}</p>
                </div>
            </div>
        `
    };

    changeContent =(e)=> {
        const el = e.target.closest('.live-play-header-link');
        const sportId = el.dataset.spid;

        localStorage.setItem('spId-sports', sportId);
        this.sportID = sportId;

        this.links.map( el => el.classList.remove('active') );
        el.classList.add('active');
        this.loadData();
    };

    loadData =()=> {
        loader.loaderOn();
        fetch(`http://bestline.bet/top/?SI=${this.sportID}`)
            .then(res => res.json())
            .then(res => this.transformData(res))
            .then(res => loader.loaderOff())
            .catch(err => console.log(err))
    };

    transformData =(data)=> {
        let MA;
        let PA;
        this.data.MA = [];

        data.map(item => {
            if(item.type === 'CL'){
                this.data.CL = item
            }
            if (item.type === 'EV'){
                this.data.EV = item
            }
            if (item.type === 'MG'){
                this.data.MG = item;
            }
            if (item.type === 'MA'){
                MA = item;
                MA.PA = [];
                this.data.MA.push(MA)
            }
            if (item.type === 'PA'){
                PA = item;
                MA.PA.push(PA)
            }
        });

        this.drawData();
    };

    firstColumn =(obj)=> {
        const { PA } = obj;
        const div = document.createElement('div');
        div.className = 'column-highlights-frs';
        div.innerHTML = `
            ${PA.map((pa, index) => {
               const { BC, NA, PD } = pa;
               const date = transformDay(BC);
               const headerColTime = this.checkDate(date[1], index) 
                   ? this.containerHeader( new Date(date[1]).toDateString()) 
                   : '';
               this.events_time.push(date);
                   
               return ` ${headerColTime}
                        <div class="highlights-cell">
                            <div class="flex-container align-center-middle">
                                <button class="button coefficient" data-pd="${PD}">
                                    <p class="font ellipsis mra">${NA}</p>
                                </button>
                            </div>
                        </div>`
            }).join('')}`
        div.querySelectorAll('.coefficient')
            .forEach(btn => btn.addEventListener('click', this.toPrematchTable))
        return div
    };

    eventsTime =()=> {
        const div = document.createElement('div');
        div.className = 'column-highlights-time';

        div.innerHTML = this.events_time.map((it, index) => {
            const ch = this.evIndexArr.some(item => item === index);
            if (it){
                return `
                    ${ch ? this.containerHeader('') : ''} 
                    <div class="highlights-cell-time">                            
                         <div class="flex-container align-center-middle time">
                            <p class="font white ellipsis">${it[0]}</p>
                         </div>
                    </div>`
            } else {
                return ''
            }
        }).join('')

        return div
    };

    betsColumn =(obj)=> {
        const div = document.createElement('div');
        div.className = 'column-highlights';
        div.innerHTML = `
                ${obj.PA.map((it, index) => {
                    const { IT, ID, FI } = it;
                    const ch = this.evIndexArr.some(item => item === index);
                    const attr = this.setAttributes(IT, ID, FI);
                    return `
                            ${ch ? this.containerHeader(obj.NA) : ""} 
                            <div class="highlights-cell">
                                <div class="flex-container align-center-middle">
                                    <button class="coef_item button coefficient" ${attr}>
                                        <p class="font">${transformBet(it.OD)}</p>
                                    </button>
                                </div>
                            </div>`}).join('')}`;

        div.querySelectorAll('.coef_item')
            .forEach(btn => btn.addEventListener('click', this.buttonData));
        return div;
    };

    moreBets =(obj)=> {
        const div = document.createElement('div');
        div.className = 'column-highlights-last';
        div.innerHTML = obj.PA.map((item, index) => {
            const ch = this.evIndexArr.some(item => item === index);

            if (item.NA) {
                return `
                     ${ch ? this.containerHeader('') : ''}
                     <div class="highlights-cell-more">
                        <div class="flex-container align-center-middle">
                            <button class="button coefficient">
                                <p class="font">${`+${item.NA}`}</p>
                            </button>
                        </div>
                     </div>`
            } else {
                ''
            }

        }).join('')

        return div
    };

    setAttributes =(it, id, fi)=> {
        return `data-id=${id} data-it=${it} data-fi=${fi}`
    };

    buttonData =(e)=> {
        const button = e.target.closest('.coefficient');
        qbC.buttonData(button);
    };

    toPrematchTable =(e)=> {
        const btn = e.target.closest('.coefficient');
        const PD = btn.dataset.pd;
        const encodePD = encodeURL(PD);

        window.location = `./#/sports/table/${encodePD}`
    };

    toggleHighlights =()=> {
        this.header.classList.toggle('closed');
        this.header.classList.toggle('open');
        this.wrapper.classList.toggle('closed');
        this.wrapper.classList.toggle('open');
    };

    drawData =()=> {
        const bets = this.data.MA;
        this.container.innerHTML = '';
        this.evDate = 0;
        this.evIndexArr = [];
        this.events_time = [];

        bets.map((item, index) => {
            if (index === 0){
                this.container.append(this.firstColumn(item));
                this.container.prepend(this.eventsTime());
            }
            if (index !== 0 && index !== bets.length-1){
               this.container.append(this.betsColumn(item));
            }
            if (index === bets.length-1){
                this.container.append(this.moreBets(item));
            }
        })

        qbC.searchActiveButton()
    };

    init =()=> {
        this.wrapper = document.getElementById('sports-highlights-bets');
        this.container = this.wrapper.querySelector('#highlightsBets-container');
        this.header = this.wrapper.querySelector('.live-play-sportCategory');
        this.header.addEventListener('click', this.toggleHighlights)
        this.wrapper.querySelectorAll('.live-play-header-link').forEach(a => {
            a.dataset.spid === this.sportID ? a.classList.add('active') : a.classList.remove('active')
            a.addEventListener('click', this.changeContent);
            this.links.push(a)
        });
        this.loadData();
    };

    checkDate =(date, index)=> {
        if (!date) return false;

        if (this.evDate !== date) {
            this.evDate = date;
            this.evIndexArr.push(index);
            return true
        } else {
            return false
        }
    };
};

window.highLightsBets = new HighlightsBets();
highLightsBets.init();
