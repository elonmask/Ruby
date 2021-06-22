window.PrematchTable = class PrematchTable {
    constructor(){
        this.codeID;
        this.data;
        this.container;
        this.tableContainer;
        this.links;
        this.sliderCount = 0;
    }

    mainTitle =(str)=> {
      this.container.querySelector('.banner-text').innerHTML = str
    };

    templateForTitle =(obj)=> {
        const { BC } = obj;
        const { TB } = this.data.EV;
        const nm = transformCMN(TB);
        this.mainTitle(nm[0]);
        const date = transformDay(BC);
        const div = document.createElement('div');
        div.className = 'prev-result';
        div.innerHTML = `
                <div class="prev-result-header">
                    <div class="prev-result-category flex-container align-middle align-justify">
                        <p class="font">${nm[0]} / ${nm[1]}</p>
                        <div class="flex-container align-middle">
                            <a class="fa fa-bar-chart prev-result-link" id="stc-btn"></a>
                            <a class="fa fa-refresh prev-result-link"></a>
                        </div>
                    </div>
                </div>
                <div class="prev-result-title">
                    <div class="prev-result-title-inner">
                        <p class="font title">${nm[2]}</p>
                        <p class="font prev-result-text">${new Date(date[1]).toDateString()}</p>
                    </div>
                </div>
                <div class="prematch-statistic hideST">
                    <div class="prev-result-row red flex-container align-justify">
                        <div class="cell">
                            <p class="font">5.</p>
                        </div>
                        <div class="cell">
                            <p class="font">Table position</p>
                        </div>
                        <div class="cell">
                            <p class="font">16.</p>
                        </div>
                    </div>
                    <div class="prev-result-row red flex-container align-justify">
                        <div class="cell">
                            <span class="font green">W</span>
                            <span class="font red">L</span>
                            <span class="font">D</span>
                            <span class="font green">W</span>
                            <span class="font red">L</span>
                        </div>
                        <div class="cell">
                            <p class="font">Last 5 games</p>
                        </div>
                        <div class="cell">
                            <span class="font green">W</span>
                            <span class="font red">L</span>
                            <span class="font">D</span>
                            <span class="font green">W</span>
                            <span class="font red">L</span>
                        </div>
                    </div>
                    <div class="prev-result-row red flex-container align-justify">
                        <div class="cell">
                            <span class="font green">W</span>
                            <span class="font red">L</span>
                            <span class="font">D</span>
                            <span class="font green">W</span>
                            <span class="font red">L</span>
                        </div>
                        <div class="cell">
                            <p class="font">Head-to-Head</p>
                        </div>
                        <div class="cell">
                            <span class="font green">W</span>
                            <span class="font red">L</span>
                            <span class="font">D</span>
                            <span class="font green">W</span>
                            <span class="font red">L</span>
                        </div>
                    </div>
                    <div class="prev-result-row red flex-container align-justify">
                        <div class="cell">
                            <p class="font">2.20</p>
                        </div>
                        <div class="cell">
                            <p class="font">Goals/Points(5 games)</p>
                        </div>
                        <div class="cell">
                            <p class="font">0.80</p>
                        </div>
                    </div>
                </div>`;

        this.addSliderToHeader(div);
        div.querySelector('#stc-btn').addEventListener('click', this.showStatistic);
        return div
    };

    templateForSliderWrapper =()=> {
        const wrapper = document.createElement('div');
        wrapper.className = 'prematch_links-wrapper flex-container';
        wrapper.innerHTML =  `
                            <button class="prematch-slide-btn left" id="to_prev" data-move="100"></button>
                                <div class="prematch_links-wrapper-inner flex-container"></div> 
                            <button class="prematch-slide-btn right" id="to_next" data-move="-100"></button>
                        `

        wrapper.querySelector('#to_prev').addEventListener('click', this.toPrevious);
        wrapper.querySelector('#to_next').addEventListener('click', this.toNext);

        return wrapper
    };

    templateForLinks =(obj)=> {
        const { MA } = obj;
        this.links = MA.map(item => {
            const { NA, PD, LS } = item;
            if (LS === '1') this.LS = NA;
            const div = document.createElement('div');
            const pd = encodeURL(PD);
            div.className = `prematch_link ${LS === '1' ? 'active' : ''}`;
            div.setAttribute('data-pd', PD);
            div.innerHTML = `<a href="./#/sports/table/${pd}">${NA}</a>`
            return div
        });

    };

    templateForTableHeader =()=> {
        const div = document.createElement('div');
        div.className = 'maTable';
        div.innerHTML = `
            <div class="maTable__row" id="maTable__row_main_top">
                  <div class="maTable__cell">
                      <div class="maTable__category">
                          <p class="icon fa fa-usd"></p>
                          <p class="text font">${this.LS || 'Main Bets'}</p>
                      </div>
                  </div>
              </div>`

        this.tableContainer = div;
        return div
    };

    templateTableRow =(obj)=> {
        const { NA, MA , PD, DO} = obj;

        const div = document.createElement('div');
        div.className = `maTable__row ${DO ? 'show_maTable' : 'hide_maTablet'}`;
        div.innerHTML = `
                        <div class="maTable__cell full" ${PD ? `data-pd="${PD}"` : ''}>
                            <div class="flex-container align-middle maInfo">
                                <span class="star maInfo__icon"></span>
                                <span class="font white ellipsis maInfo__text"> ${NA}</span>
                                <hr class="maInfo__separate">
                                <a class="maInfo__inform"></a>
                            </div>
                        </div>`;

        PD
            ? div.querySelector('.maTable__cell').addEventListener('click', this.getHiddenBets)
            : div.querySelector('.maTable__cell').addEventListener('click', this.hideShowCategory);
        div.querySelector('.star').addEventListener('click', this.toTop);
        MA.map(it => this.templateTableCell(it,div, MA.length));
        return div
    };

    templateTableCell =(obj, node, length)=> {
        const { PA, SY, NA } = obj;

        if (NA !== undefined && SY !== 'cy') {
            const style = length%2 !== 0 || length === 6 ? 'flex30' : '';
            this.pasteColumnCell(obj, node, style);
        } else {
            if (PA.length%2 === 0 && SY === 'zg'){
                this.pasteRowCell(PA, node, 'half-half')
            } else if (PA.length%2 === 0){
                this.pasteRowCell(PA, node, 'half')
            } else {
                this.pasteRowCell(PA, node);
            }
        }
    };

    pasteRowCell =(PA, node, styles = '')=> {
        PA.map(item => {
            const { NA, OD, HD, SU, BL, ID, IT, FI } = item;

            const disabled = SU === '1' || !SU && !OD ? 'disabled' : '';
            const align = (NA || HD) && BL === undefined ? 'coefficient' : 'coefficient-title';
            const attributes = this.setButtonAttributes(ID, IT, FI);

            const div = document.createElement('div');
            div.className = `maTable__cell ${styles}`;
            div.innerHTML = `
                    <button class="coef_item button ${align} ${disabled}" ${attributes}>
                        <p class="font ellipsis">${BL === undefined ? HD || NA || '' : ''}</p>
                        ${this.cellContent(SU, OD)}
                    </button`;

            div.querySelector('.coef_item').addEventListener('click', this.makeStakeReq);
            node.appendChild(div)
        })
    };

    pasteColumnCell =(obj, node, styles)=> {
        const { PA, NA, SY } = obj;
        const title = SY === 'cdd' || SY === 'cde' || SY === 'cdh' || SY === 'cal'   ? 'title' : '';

        const div = document.createElement('div');
        div.className = `bets_column ${title || styles}`;
        div.innerHTML = `
            ${PA.map(item => {
            const { NA, OD, HD, SU, BL, ID, IT, FI } = item;
            
            const disabled = SU === '1' || !SU && !OD ? 'disabled' : '';
            const align = (NA || HD) && BL === undefined ? 'coefficient' : 'coefficient-title';
            const attributes = title ? '' : this.setButtonAttributes(ID, IT, FI);
            
            return `<div class="maTable__cell">
                        <button class="coef_item button ${align} ${disabled}" ${attributes}>
                            <p class="font ellipsis">${BL === undefined ? HD || NA || '' : ''}</p>
                           ${this.cellContent(SU,OD)}
                        </button>
                    </div>`}).join('')}`;

        div.querySelectorAll('.coef_item')
            .forEach(item => item.addEventListener('click',  this.makeStakeReq));

        NA ?  div.prepend(this.titleTemplateForBets(NA)) : null;
        node.append(div)
    };

    titleTemplateForBets =(NA)=> {
        const div = document.createElement('div');
        div.className = 'bets_title';
        div.innerHTML = `${NA}`
        return div
    };

    loadData =()=> {
        fetch(`http://bestline.bet/sports/?PD=${this.codeID}`)
            .then(res => res.json())
            .then(res => this.transformData(res))
            .then(res => this.drawData())
            .then(res => loader.loaderOff())
            .catch(err => console.log(err))
    };

    transformData =(data)=> {
        this.data = {};
        this.data.MG = [];

        let MG;
        let MA;

        data.map(item => {
            if (item.type === 'CL'){
                this.data.CL = item;
            }
            if (item.type === 'EV'){
                this.data.EV = item;
            }
            if (item.type === 'MG'){
                const danger = checkDangerId(item.ID);
                const dangerMG =  danger && !checkMG(item);

                if (!dangerMG){
                    MG = item;
                    MG.MA = [];
                    this.data.MG.push(item);
                }
            }
            if (item.type === 'MA'){
                if (!MG) console.log(item)
                MA = item;
                MA.PA = [];
                MG.MA.push(item)
            }
            if (item.type === 'PA'){
                MA.PA.push(item)
            }
        });

    };

    drawData =()=> {
        const { MG } = this.data;
        MG.map(item => {
            if(item.IT === 'MBSM' && item.SY === 'cm'){
                this.templateForLinks(item);
                return
            }

            if (item.SY === 'cu'){
                const elem = this.templateForTitle(item);
                const tbCont = this.templateForTableHeader();

                this.container.appendChild(elem);
                this.container.appendChild(tbCont);
                return;
            }

            const elem = this.templateTableRow(item);
            this.tableContainer.appendChild(elem)
        });

        qbC.searchActiveButton();
    };

    init =()=> {
        loader.loaderOn()
        this.getUrl();
        this.loadData();
    };

    /* ---- */

    toTop =(e)=> {
        e.stopPropagation();
        const parent = e.target.closest('.maTable__row');
        e.target.classList.toggle('star_active');
        parent.classList.toggle('betToTop');
    };

    hideShowCategory =(e)=> {
        const elem = e.target.closest('.maTable__row');
        elem.classList.toggle('hide_maTablet');
        elem.classList.toggle('show_maTable');
    };

    addSliderToHeader =(div)=> {
        if (this.links){
           const slider = this.templateForSliderWrapper();
           const linksWrapper= slider.querySelector('.prematch_links-wrapper-inner');
           this.links.forEach(a => linksWrapper.append(a));

           const header = div.querySelector('.prev-result-header');
           header.after(slider)
        }
    };

    getHiddenBets =(e)=> {
        const cell = e.target.closest('.maTable__cell');
        const pd = encodeURL(cell.dataset.pd);
        fetch(`http://bestline.bet/sports/?PD=${pd}`)
            .then(res => res.json())
            .then(res => console.log(res))
            .catch(err => console.log(err))

    };

    getUrl =()=> {
      this.container = document.querySelector('.prematch-table-container');
      const hash = window.location.hash;
      this.codeID = hash.split('/')[3];
    };

    getSliderContainerWidth =()=> {
        const sliderWrapper = this.container.querySelector('.prematch_links-wrapper-inner');
        const innerWidth = sliderWrapper.offsetWidth;
        const scrollWidth = sliderWrapper.scrollWidth;

        return scrollWidth - innerWidth;
    };

    toPrevious =()=> {
        this.sliderCount -=100;
        if (this.sliderCount < 0){
            this.sliderCount = 0
        }

        this.links.forEach(a => a.style.transform = `translate(-${this.sliderCount}px, 0px)`)
    };

    toNext =()=> {
        const scrWidth = this.getSliderContainerWidth();

        if (scrWidth > this.sliderCount){
            this.sliderCount += scrWidth - this.sliderCount;
        }

        if (this.sliderCount > scrWidth && scrWidth !== 0){
            this.sliderCount += scrWidth;
        }


        this.links.forEach(a => a.style.transform = `translate(-${this.sliderCount}px, 0px)`)
    };

    showStatistic =()=> {
        const statWrapper = this.container.querySelector('.prematch-statistic');
        statWrapper.classList.toggle('hideST')
        statWrapper.classList.toggle('openST')
    };

    setButtonAttributes =(id, it, fi)=> {
        return `data-id=${id} data-fi=${fi} data-it=${it}`
    };

    cellContent =(SU, OD)=> {
        if (SU || OD){
            if (SU === '1'){
                return '<span class="fa fa-lock lock"></span>'
            } else {
                return `<p class="font down blick">${transformBet(OD)}</p>`
            }
        } else {
            return ''
        }
    };

    makeStakeReq =(e)=> {
        const elem = e.target.closest('.coef_item');
        qbC.buttonData(elem);
    };
};

window.prematchTable = new PrematchTable();
prematchTable.init();
