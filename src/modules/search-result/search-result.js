window.SearchResult = class SearchResult {
    constructor() {
        this.input;
        this.wrapper;
        this.currentSport = '1';
        this.sliderWrapper;
        this.sliderItem;
        this.movingCount = 0;
    }

    headerLinksTemplate = (obj) => {
        const div = document.createElement('div');
        div.className = 'search-header-outer';
        div.innerHTML = `
            <button class="font white search-close-btn">Close</button>
            <button class="fa fa-chevron-left slide-btn" id="prev"></button>
            <ul class="search-header-inner">
                ${obj.map(item => {
            const { NA, ID } = item;
            return `<li class="font white ellipsis search-headet-item" data-id="${ID}">${NA}</li>`
        }).join('')}                
            </ul>
            <button class="fa fa-chevron-right slide-btn" id="next"></button>`;

        this.sliderWrapper = div.querySelector('.search-header-inner');
        this.sliderItem = div.querySelectorAll('.search-headet-item');
        this.sliderItem.forEach(a => a.addEventListener('click', this.changeCurrentSport));
        div.querySelector('.search-close-btn').addEventListener('click', this.closeSearchPage);
        div.querySelector('#prev').addEventListener('click', this.toBack);
        div.querySelector('#next').addEventListener('click', this.toNext);
        this.wrapper.appendChild(div)
    };

    searchCategoryContainer = (obj) => {
        const { NA, MG } = obj;
        const div = document.createElement('div');
        div.className = 'search-content-container-outer';
        div.innerHTML = `<h2 class="container-title">${NA}</h2>`;

        this.searchInnerCategoryContainer(MG, div);
        this.wrapper.appendChild(div)
    };

    searchInnerCategoryContainer = (arr, node) => {
        arr.map(item => {
            const { NA, PD, MA } = item;
            const div = document.createElement('div');
            div.setAttribute('data-pd', PD);
            div.className = 'search-content-container-inner';
            div.innerHTML = `<h2 class="inner-container-title">${NA}</h2>`;

            this.matchBettings(MA, div);
            div.querySelector('.inner-container-title').addEventListener('click', this.showHideCategory)
            node.appendChild(div)
        });

    };

    matchBettings = (arr, node) => {
        const div = document.createElement('div');
        div.className = 'inner-eventCategory-container flex-container';
        arr.map((item, index) => {
            const { PA } = item;
            if (index === 0) {
                this.eventInformation(PA, div)
            }
            if (index !== 0) {
                this.eventBets(PA, div)
            }
        });
        node.appendChild(div);
    };

    eventInformation = (arr, node) => {
        const divCT = document.createElement('div');
        divCT.className = 'eventCategory-main-info-container';
        arr.map(item => {
            const { NA, PD, BC } = item;
            const date = transformDay(BC) || ['', ''];
            const div = document.createElement('div');
            div.className = 'eventCategory-main-info';
            div.setAttribute('data-pd', PD)
            div.innerHTML = ` 
                  <div class="event-name">${NA}</div>   
                  <div class="event-date">${new Date(date[1]).toDateString()} ${date[0]}</div>   
            `
            divCT.appendChild(div);
        });
        node.appendChild(divCT)
    };

    eventBets = (arr, node) => {
        const divCT = document.createElement('div');
        divCT.className = 'eventCategory-main-info-container';
        arr.map(item => {
            const { ID, FI, PF, NA, OD, PD, SU } = item;
            const stake = transformBet(OD);
            const div = document.createElement('div');
            div.className = `event-bets ${SU == 1 ? 'disabled' : ''}`;
            div.setAttribute('data-id', ID);
            div.setAttribute('data-fi', FI);
            div.setAttribute('data-pf', PF);
            div.setAttribute('data-pd', PD);
            div.setAttribute('id', 'searchBet');
            div.innerHTML = ` 
                  <div class="bets-name">${NA || ''}</div>   
                  <div class="bets-stake">${stake || ''}</div>   
            `
            div.addEventListener('click', (e) => {
                console.log('ID: ' + ID);
                console.log('PD: ' + PD);
            });
            divCT.appendChild(div);
        });

        node.appendChild(divCT)
    };

    getUrl = () => {
        this.searchStr = window.location.hash.split('/')[2];
    };

    getData = () => {
        fetch(`http://bestline.bet/search/?query=${this.searchStr}`)
            .then(res => res.json())
            .then(res => this.transformData(res))
            .then(res => this.headerLinksTemplate(this.data.CL))
            .then(res => this.drawData())
            .catch(err => console.log(err))
    };

    transformData = (res) => {
        this.data = {};
        this.data.CL = [];

        let CL;
        let EV;
        let MG;
        let MA;

        res.forEach(item => {
            if (item.type === 'CL') {
                CL = item;
                CL.EV = [];
                this.data.CL.push(item)
            }
            if (item.type === 'EV') {
                EV = item;
                EV.MG = [];
                CL.EV.push(item);
            }
            if (item.type === 'MG') {
                MG = item;
                MG.MA = [];
                EV.MG.push(MG)
            }
            if (item.type === 'MA') {
                MA = item;
                MA.PA = [];
                MG.MA.push(MA)
            }
            if (item.type === 'PA') {
                MA.PA.push(item)
            }
        });
    };

    drawData = () => {
        const { CL } = this.data;

        CL.forEach(item => {
            if (item.ID === this.currentSport) {
                const { EV } = item;
                if (EV) {
                    EV.forEach(it => {
                        this.searchCategoryContainer(it)
                    });
                }
            }
        });

    };

    toBack = () => {
        const { sliderItem, movingCount } = this;
        this.movingCount = movingCount + 100;

        if (this.movingCount > 0) {
            this.movingCount = 0
        }

        sliderItem.forEach(item => {
            item.style.transform = `translate(${this.movingCount}px, 0px)`
        });
    };

    toNext = () => {
        const { sliderWrapper, sliderItem, movingCount } = this;
        const scrWidth = sliderWrapper.scrollWidth - sliderWrapper.clientWidth;

        if (scrWidth !== 0 || scrWidth > 0) {
            this.movingCount = movingCount - 100;
        } else {
            return
        }

        sliderItem.forEach(item => {
            item.style.transform = `translate(${this.movingCount}px, 0px)`
        });
    };

    changeCurrentSport = (e) => {
        this.currentSport = e.target.dataset.id;
        this.clearContentContainer();
        this.drawData();
    };

    clearContentContainer = () => {
        this.wrapper.querySelectorAll('.search-content-container-outer')
            .forEach(item => this.wrapper.removeChild(item))
    };

    showHideCategory = (e) => {
        const parent = e.target.closest('.search-content-container-inner');
        parent.classList.toggle('hide_inner_cont')
    };

    init = () => {
        this.wrapper = document.querySelector('.search-container');
        this.input = document.querySelector('#search_inp');
        this.input.focus();
        this.getUrl();
        this.getData();
    };

    closeSearchPage = () => {
        const prevPage = sessionStorage.getItem('BackFromSeacrh') || '#/sports/';
        sessionStorage.setItem('SrgDt', '');
        window.location.hash = prevPage;
    };
};

window.searchResult = new SearchResult();
searchResult.init();
