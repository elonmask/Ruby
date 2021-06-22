class Classification {
    constructor() {
        this.container;
        this.data;
        this.categData;
        this.categNode;
    }

    //SubCategory logic//
    templateSubCategory = (obj) => {
        const { NA, IT, PD } = obj;
        const bool = this.checkSportKind();
        const div = document.createElement('div');
        div.setAttribute('data-it', IT);
        div.setAttribute('data-pd', PD);
        div.className = 'classification__subcategory cloSed';
        div.innerHTML = `
                         <div class="classification__subcategory_content cloSed">
                                <p class="font">${NA}</p> 
                         </div>
                         <div class="classification__subcategory_container"></div>
                        `
        bool ? div.addEventListener('click', this.goToPremathcTable) : div.addEventListener('click', this.getEventData);
        return div
    };

    getSubCategoryData = (e) => {
        const prnEl = e.target.closest('.classification__category');
        const catCont = e.target.closest('.classification__category_content');
        const subCat = prnEl.querySelector('.classification__subcategory');

        const pd = prnEl.dataset.pd;
        const id = prnEl.dataset.id;

        if (id === '-1') {
            window.location = './#/sports/'
            return
        }
        if (id === '-2') {
            window.location = './#/inplay/overview'
            return;
        }

        if (!subCat) {
            this.subCategoryDataReq(pd, prnEl, id);
        }
        this.addClassToElem(prnEl, catCont)
    };

    subCategoryDataReq = (pd, node, id) => {
        const code = encodeURL(pd);
        this.loaderShow(node)
        fetch(`http://bestline.bet/sports/?PD=${code}`)
            .then(res => res.json())
            .then(res => this.transformSubCategoryData(res))
            .then(res => this.drawSubCategoryData(node, id))
            .then(res => this.loaderHide(node))
            .catch(err => console.log(err))
    };

    transformSubCategoryData = (res) => {
        this.categData = {};
        this.categData.MG = [];
        let MG;
        let MA;

        res.map(item => {
            if (item.type === 'CL' && item.ID) {
                this.categData[item.type] = item;
            }
            if (item.type === 'EV') {
                this.categData[item.type] = item;
            }
            if (item.type === 'MG') {
                MG = item;
                MG.MA = [];
                this.categData.MG.push(item)
            }
            if (item.type === 'MA') {
                MA = item;
                MA.PA = [];
                MG.MA.push(item)
            }
            if (item.type === 'PA') {
                MA.PA.push(item)
            }
        });

        console.log(this.categData)
    };

    drawSubCategoryData = (node, id) => {
        const obj = this.categData;
        const elem = node.querySelector('.classification__category_container');
        if (id === '1') {
            this.categNode = obj.MG.map(item => {
                if (item.NA === 'Full Time Result') {
                    item.MA.map(it => {
                        return elem.appendChild(this.templateSubCategory(it))
                    });
                }
            });
        } else {
            this.categNode = obj.MG.map(item => {
                if (item.NA) {
                    return elem.appendChild(this.templateSubCategory(item))
                }
            });
        }
    };
    //SubCategory logic//

    //Events logic//
    templateForEvent = (obj) => {
        const { NA, ID, IT, PD } = obj;
        const div = document.createElement('div');
        div.setAttribute('data-id', ID)
        div.setAttribute('data-id', IT)
        div.setAttribute('data-id', PD)
        div.className = 'classification__link';
        div.innerHTML = `
                    <a href="#/sports/${encodeURL(PD)}">
                      <p class="font m-white ellipsis">${NA}</p>
                    </a>`

        div.addEventListener('click', this.stopPropEvent)
        return div
    };

    getEventData = (e) => {
        e.stopPropagation();
        const prnEl = e.target.closest('.classification__subcategory');
        const subCatCont = e.target.closest('.classification__subcategory_content');
        const subCat = prnEl.querySelector('.classification__link');
        const pd = prnEl.dataset.pd;

        if (!subCat) {
            this.eventDataReq(pd, prnEl)
        }

        this.addClassToElem(prnEl, subCatCont)
    };

    transformEventData = (res) => {
        this.eventData = {};
        let MG;
        let MA;
        let PA;
        res.map(item => {
            if (item.type === 'MG') {
                MG = item;
                this.eventData.MG = MG;
            }
            if (item.type === 'MA') {
                MA = item;
                this.eventData.MA = MA;
                MA.PA = [];
            }
            if (item.type === 'PA') {
                PA = item;
                MA.PA.push(item);
            }
        })
    };

    eventDataReq = (pd, node) => {
        const code = encodeURL(pd);
        fetch(`http://bestline.bet/sports/?PD=${code}`)
            .then(res => res.json())
            .then(res => this.transformEventData(res))
            .then(res => this.drawEvents(node))
            .catch(err => console.log(err))
    };

    drawEvents = (node) => {
        const PA = this.eventData.MA.PA;
        const elem = node.querySelector('.classification__subcategory_container');

        this.eventsNode = PA.map(item => {
            return elem.appendChild(this.templateForEvent(item))
        });
    };

    //Events logig//

    //Main //

    templateCategory = (obj) => {
        const { PD, ID, NA, IT } = obj;
        const ln = ID === '-1' || ID === '-2';
        const none = this.hideCategory(ID);
        /**/
        const div = document.createElement('div');
        div.setAttribute('data-id', ID);
        div.setAttribute('data-pd', PD);
        div.setAttribute('data-it', IT);
        div.className = `classification__category ${ln ? '' : 'cloSed'} ${none ? 'hide' : ''}`;
        div.innerHTML = `
                        <div class="sm-loader-bl"></div>
                        <div style="background:url(${'http://bestline.bet/icon/sport/' + ID}) center no-repeat;"></div>
                        <div class="classification__category_content ${ln ? 'notCtg' : 'cloSed'}">
                            <p class="font">${NA}</p>
                            <p></p>
                        </div>
                        <div class="classification__category_container"></div>
                        `

        div.addEventListener('click', this.getSubCategoryData);
        const starElement = div.querySelector('.star');
        starElement ? starElement.addEventListener('click', this.toFavour) : null
        return div
    };

    drawData = () => {
        this.data.map(it => {
            this.container.appendChild(this.templateCategory(it))
        });
    };

    transformData = (data) => {
        this.data = data.filter(item => item.type === "CL" ? item : null);
        this.drawData();
    };

    loadData = () => {
        fetch('http://bestline.bet/sports/?PD=all')
            .then(res => res.json())
            .then(res => this.transformData(res))
            .catch(err => console.log(err))
    };

    init = () => {
        this.container = document.getElementById('classification_container');
        this.loadData()
    };

    //Main//

    addClassToElem = (el1, el2) => {
        el1.classList.toggle('oPen');
        el1.classList.toggle('cloSed');
        el2.classList.toggle('oPen');
        el2.classList.toggle('cloSed')
    };

    stopPropEvent = (e) => {
        e.stopPropagation()
    };

    toFavour = (e) => {
        e.stopPropagation();
        const elem = e.target;
        const prnt = elem.closest('.classification__category');
        this.slideUpCategory(prnt)

        this.data.map(item => {
            if (item.ID === prnt.dataset.id) {
                this.addSportToStor(item)
            }
        });
    };

    addSportToStor = (obj) => {
        const favSports = JSON.parse(localStorage.getItem('favSports')) || [];
        favSports.push(obj);
        localStorage.setItem('favSports', JSON.stringify(favSports))
    };

    hideCategory = (id) => {
        const storageData = JSON.parse(localStorage.getItem('favSports'));
        if (storageData) {
            const bool = storageData.some(it => it.ID === id);
            return bool
        }
    };

    checkSportKind = () => {
        const ids = ['18', '13', '17', '91'];
        const id = this.categData.CL.ID || '';
        return ids.some(it => it === id);
    };

    goToPremathcTable = (e) => {
        e.stopPropagation();
        const parent = e.target.closest('.classification__subcategory');
        const pd = parent.dataset.pd;

        const newPD = pd.substr(0, pd.length - 2).replace('AS', 'AC');
        const hash = encodeURL(newPD);

        window.location = `./#/sports/${hash}`;
    };

    loaderShow = (node) => {
        node.querySelector('.sm-loader-bl').classList.add('sm-loader-bl-sh');
    };

    loaderHide = (node) => {
        node.querySelector('.sm-loader-bl').classList.remove('sm-loader-bl-sh');
    };

    slideUpCategory = (prnt) => {
        prnt.classList.add('slideUp');
        prnt.style.transform = `translate(0px, -${prnt.offsetTop + 10}px)`
        setTimeout(() => {
            prnt.classList.remove('slideUp');
            prnt.classList.add('hide');
            favSports.addSport();
            prnt.style.transform = 'translate(0px, 0px)'
        }, 500)
    };
};

window.classification = new Classification();
classification.init();
