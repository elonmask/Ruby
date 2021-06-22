window.FavouriteSports = class FavouriteSports {
    constructor(){
        this.wrapper;
        this.container;
        this.header;
        this.data;
    }

    //Category Items Logic//
    init =()=> {
        this.wrapper = document.querySelector('.favourite');
        this.header = this.wrapper.querySelector('.favourite__category');
        this.container = this.wrapper.querySelector('.favourite-container');
        this.header.addEventListener('click', this.showFav);
        this.addSport();

        const loadLastOpCateg = this.lastOpenCategoryGET();
        if (loadLastOpCateg){
            this.loadLastOpenCategory(loadLastOpCateg)
        }
    };

    addSport =()=> {
         this.data = JSON.parse(localStorage.getItem('favSports')) || [];
         this.drawData()
    };

    drawData =()=> {
        this.container.innerHTML = '';
        this.data.map(item => {
            this.container.appendChild(this.render(item))
        });
    };

    render =(obj)=> {
        const { NA, ID, IT, PD } = obj;
        const div = document.createElement('div');
        div.className = 'favourite_item';
        div.setAttribute('data-id', ID);
        div.setAttribute('data-pd', PD);
        div.setAttribute('data-it', IT);
        div.innerHTML = `
              <div class="sm-loader"></div>
              <a class="flex-container align-middle align-justify favourite__link">
                  <span class="sports-5 favourite__icon"></span>
                  <span class="font ellipsis favourite__text">${NA}</span>
                  <span class="font favourite__text"></span>
                  <span class="star star_active"></span>
              </a>         
              <div class="events_wrapper flex-container flex-dir-column"></div>`

        div.addEventListener('click', this.getNodeData);
        div.querySelector('.star').addEventListener('click', this.removeFromFavour);
        return div
    };

    getNodeData =(e)=> {
        const elem = e.target.closest('.favourite_item');
        const wrapper = elem.querySelector('.events_wrapper');
        const loader = elem.querySelector('.sm-loader');
        const elemDataset = elem.dataset;

        this.lastOpenCategorySET(elemDataset);
        this.markActive(elem);

        if (!elem.classList.contains('active')){
            this.lastOpenCategoryRemove()
        }

        if (!this.checkIfEv(wrapper)){
            this.dataReq(elemDataset.pd, wrapper, loader)
        }
    };
    //Category Items Logic//

    /* SUBCATEGORY LOGIC*/
    dataReq =(pd, node, loader)=> {
        loader.classList.add('sm-loader-show');
        const code = encodeURL(pd);
        fetch(`http://bestline.bet/sports/?PD=${code}`)
            .then(res => res.json())
            .then(res => this.transformData(res))
            .then(res => this.drawSubCategory(node))
            .then(res => loader.classList.remove('sm-loader-show'))
            .catch(err => console.log(err))
    };

    transformData =(res)=> {
        this.categData = {};
        this.categData.MG = [];
        let MG;
        let MA;

        res.map(item => {
            if (item.type === 'CL' && item.ID){
                this.categData[item.type] = item;
            }
            if (item.type === 'EV'){
                this.categData[item.type] = item;
            }
            if (item.type === 'MG'){
                MG = item;
                MG.MA = [];
                this.categData.MG.push(item)
            }
            if (item.type === 'MA'){
                MA = item;
                MA.PA = [];
                MG.MA.push(item)
            }
            if (item.type === 'PA'){
                MA.PA.push(item)
            }
        });
    };

    drawSubCategory =(node)=> {
        const { MG, EV } = this.categData;

        if (EV.CL !== '1'){
            MG.map(item => {
                if (item.NA){
                    node.appendChild(this.subCategoryTemplate(item))
                }
            })
        } else {
            MG.map(item => {
                if (item.NA === 'Full Time Result'){
                    item.MA.map(it => {
                        node.appendChild(this.subCategoryTemplate(it))
                    });
                }
            });
        }
    };

    subCategoryTemplate =(obj)=> {
        const { NA, PD, IT } = obj;
        const div = document.createElement('div');
        div.setAttribute('data-pd', PD);
        div.setAttribute('data-it', IT);
        div.className = 'favourite_event cloSed';
        div.innerHTML = ` 
              <div class="sm-loader"></div>
              <div class="favourite_event-title">${NA}</div>
              <div class="favourite_event-inner"></div>`;
        div.addEventListener('click', this.getSubCategoryData);
        return div
    };

    getSubCategoryData =(e)=> {
        e.stopPropagation();
        const parent = e.target.closest('.favourite_event');
        const eventContainer = parent.querySelector('.favourite_event-inner');
        const data = parent.dataset;

        const bool = this.checkSportId();
        if (bool){
            this.goToPrematchList(data.pd)
        } else {
            parent.classList.toggle('oPen');
            parent.classList.toggle('cloSed');
            //
            if (eventContainer.childNodes.length === 0){
                const loader = parent.querySelector('.sm-loader');
                this.getSubCategoryEvent(data.pd, eventContainer, loader);

            }
        }
    };

    goToPrematchList =(pd)=> {
        const newPD = pd.substr(0, pd.length - 2).replace('AS','AC');
        const hash = encodeURL(newPD);
        this.changeLocation(hash)
    };
    /* SUBCATEGORY LOGIC*/

    /*Event LOGIC*/
    eventTemplate =(item)=> {
        const { NA, IT, PD } = item;
        const div = document.createElement('div');
            div.setAttribute('data-it', IT);
            div.setAttribute('data-pd', PD);
            div.className = 'favourite_event-item';
            div.innerHTML = `
                <div>${NA}</div> 
            `
        div.addEventListener('click', this.loadPrematchList)
        return div
    };

    getSubCategoryEvent =(pd, node, loader)=> {
        const code = encodeURL(pd);
        loader.classList.add('sm-loader-bl-sh');
        fetch(`http://bestline.bet/sports/?PD=${code}`)
            .then(res => res.json())
            .then(res => this.transformEvData(res))
            .then(res => this.drawEventData(node))
            .then(res => loader.classList.remove('sm-loader-bl-sh'))
            .catch(err => console.log(err))
    };

    transformEvData =(res)=> {
        this.evData = res.filter(item => item.type === 'PA');
    };

    drawEventData =(node)=> {
        this.evData.map(item => node.appendChild(this.eventTemplate(item)))
    };

    loadPrematchList =(e)=> {
        const elem = e.target.closest('.favourite_event-item');
        const pd = elem.dataset.pd;
        const hash = encodeURL(pd);

        this.changeLocation(hash);
    };
    /*Event LOGIC*/

    checkIfEv =(node)=> {
       if (node.childNodes.length !== 0){
           return true
       } else {
           false
       }
    };

    markActive =(elem)=> {
        const prnt = elem.querySelector('.favourite__link');
        elem.classList.toggle('active');
        prnt.classList.toggle('active');
    };

    checkSportId =()=> {
      const ids = ['18', '13', '17', '91'];
      const curntSport = this.categData.CL.ID || '';
      return ids.some(item => item === curntSport );
    };

    showFav =()=> {
        this.wrapper.classList.toggle('cloSed');
        this.wrapper.classList.toggle('oPen');
        this.header.classList.toggle('open')
    };

    removeFromFavour =(e)=> {
        e.stopPropagation();
        const parent = e.target.closest('.favourite_item');
        const id = parent.dataset.id;

        this.removeFromClassification(id);
        this.removeFromStor(id)

        this.container.removeChild(parent)
    };

    removeFromClassification =(id)=> {
        if (classification.container){
            const wrapper = classification.container;
            wrapper.querySelector(`.classification__category[data-id="${id}"]`)
                .classList.remove('hide')
        }
    };

    removeFromStor =(id)=> {
        const localData = JSON.parse(localStorage.getItem('favSports'));
        const filteredData = localData.filter(it => it.ID !== id);
        localStorage.setItem('favSports', JSON.stringify(filteredData))
    };

    lastOpenCategorySET =(obj)=> {
        localStorage.setItem('LSOpFV', JSON.stringify(obj));
    };

    lastOpenCategoryGET =()=> {
        const LSData = JSON.parse(localStorage.getItem('LSOpFV'))
        return LSData;
    };

    lastOpenCategoryRemove =()=> {
        localStorage.removeItem('LSOpFV')
    };

    loadLastOpenCategory =(obj)=> {
        const { id, pd } = obj;
        ///
        const node = this.container.querySelector(`.favourite_item[data-id="${id}"]`);
        ///
        this.markActive(node);
        ///
        const wrapper = node.querySelector('.events_wrapper ');
        const loader = node.querySelector('.sm-loader');
        this.dataReq(pd, wrapper, loader)
    };

    changeLocation =(hash)=> {
        window.location = `./#/sports/${hash}`;
    };
};

window.favSports = new FavouriteSports();
favSports.init();

