import { createElement } from "../../../helpers/createElement";
import { findNode, getRequest } from '../../../helpers/utils'
import { links } from "../../../links/links";
import { EventCategory } from "../eventCategory/eventCategory";
import { getFromStorage, writeToStorage } from "../../../storage/storageMethod";
import countryImages from '../../../json/countries.json'
import internationalFlag from '../../../img/icon-country/int.png'

const isOpen =(id)=> window.location.hash.split('/')[4] === id.toString()

export class LeaguesCategory {
  constructor(data) {
    this.data = data;
    this.iconCode = data.iconCode
    this.div = null;
    this.type = "div";
    this.classes = ["classification__subcategory"];
    this.listeners = [
      {
        event: "click",
        cb: this.drawData,
      },
    ];
    this.url = links.prematchLeague;
    this.events = null;
    this.open = false;
    this.image = null;
  }

  eventRequest = async () => {
    const url = this.url + this.data.id;

    try {
      return await getRequest(url);
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  getEventData = async () => { 
    if (this.events) {
      return this.events;
    }

    const { events } = await this.eventRequest();
    //console.log(events)
    this.events = events;
  };

  drawData = (e) => {
    e.stopPropagation();
    if (e.target.dataset.clickable != false) {
      e.target.dataset.clickable = false;
    const id = this.data.id;
    const sportId = this.data.sportId;
    
    if (typeof window.changePrematchList !== "undefined" && window.location.hash != "#/sports/" && !window.location.hash.includes("table")) {
      document.querySelector(`[data-lid="${window.location.hash.split("/")[4]}"]`).style = "";
      window.history.pushState(
        '',
        '',
        `./#/sports/list/${sportId}/${id}`
      )
      document.querySelector(`[data-lid="${window.location.hash.split("/")[4]}"]`).style.backgroundColor = "#3a4a4f";
      window.changePrematchList();
    } else {
      window.location.hash = `#/sports/list/${sportId}/${id}`;
    }
    //console.log(window.location.hash)
    /*if (this.open) {
      this.hideLeague();
    } else {
      this.openLeague();
    }*/
    setTimeout(()=> {
      e.target.dataset.clickable = true;
    }, 1000);
    }
  };

  openLeague = async () => {
    /*await this.getEventData();
    if (typeof window.openedEV === 'undefined') {
      window.openedEV = [];
      window.openedEV.push(this.data.name);
      console.log(this.data.name)
    } else {
      window.openedEV.push(this.data.name);
      console.log(this.data.name)
    }
    this.open = true;
    const eventContainer = this.div.querySelector(
      ".classification__subcategory_container"
    );
    if (this.events && this.events.length) {
      this.events.forEach((event) => {
        const eventItem = new EventCategory(event);
        eventContainer.append(eventItem.render());
      });
    } else {
      eventContainer.append(this.emptyMessage());
    }*/
  };

  hideLeague = () => {

    // window.openedEV.forEach((item, idx) => {
    //   if (item == this.data.name) {
    //     window.openedEV[idx] = '';
    //   }
    // })

    this.open = false;

    const eventContainer = this.div.querySelector(
      ".classification__subcategory_container"
    );

    eventContainer.innerHTML = "";
  };

  emptyMessage = () => {
    const div = createElement({
      type: "div",
      classes: ["classification__link", "m-white", "ellipsis"],
      attributes: [
        {
          name: "style",
          value: `color:white; padding:12px`,
        },
      ],
    });

    div.innerText = "There are no any events in this leagues";

    return div;
  };

	getImage = async ()=> {
		if (this.iconCode && countryImages[this.iconCode]){
			const imagePath = countryImages[this.iconCode] + '.png'
			return await import(`../../../img/icon-country/${imagePath}`)
		}
		return internationalFlag
	}

	appendImage = async ()=> {
		const subcategory = findNode('.', 'classification__subcategory_content__title_country', this.div)

		try {
			const image = await this.getImage()
			const img = createElement({
				type:'img',
				attributes:[{name:'src', value:image.default || image}],
				classes:['icon_country']
			})
			subcategory.prepend(img)
		} catch(e){
			console.log(e)
		}
  }
  
  renderCountry = (name) => {
   // console.log(this.data)
  // console.log(name)
    let elementData = {
      type: this.type,
      classes: this.classes
      
    }
    this.div = createElement(elementData);
    this.div.innerHTML = ` 
    <div class="classification__subcategory_content country" data-id="cname">
      <div class="flex-container align-middle classification__subcategory_content__title_country" data-id="cname" style="margin-left: 10px; max-width: 190px">
        <p class="font ellipsis" data-id="cname" style="line-height: 34px; text-transform: none">${name == null || name == 'undefined' ? 'International' : name}</p>
      </div>
    </div>
    <div id="${this.iconCode}" class="classification__subcategory_container_${this.iconCode}" data-id="cname"></div>`;
    this.appendImage()

    return this.div;
  }

  render = (code) => {
    let leaguesArr = getFromStorage('prematchLeagues');
    leaguesArr.push({ name: this.data.name, id: this.data.id });
    writeToStorage('prematchLeagues', leaguesArr);

      let elementData = {
        type: this.type,
        classes: this.classes,
        listeners: this.listeners,
      };
  
      this.div = createElement(elementData);
      this.div.innerHTML = ` <div class="classification__subcategory_content" data-lid="${this.data.id}" style="${window.location.hash.includes(this.data.id) ? "background-color: #3a4a4f" : ''}">
                              <div class="flex-container align-middle classification__subcategory_content__title" style="margin-left: 25px; max-width: 190px">
                              		<p class="font ellipsis" data-id="cname" style="line-height: 34px; text-transform: none">${this.data.name}</p>
															</div>
                          	</div>
                          	<div class="classification__subcategory_container"></div>`;

    sessionStorage.setItem('lastIconCode', code);
 
    if (isOpen(this.data.id)){
      this.openLeague()
    }

    return this.div;
  };
}

// const { NA, IT, PD } = obj;
// const bool = this.checkSportKind();
// const div = document.createElement('div');
// div.setAttribute('data-it', IT);
// div.setAttribute('data-pd', PD);
// div.className = 'classification__subcategory cloSed';
// div.innerHTML = `
//                          <div class="classification__subcategory_content cloSed">
//                                 <p class="font">${NA}</p>
//                          </div>
//                          <div class="classification__subcategory_container"></div>
//                         `
// bool ? div.addEventListener('click', this.goToPremathcTable) : div.addEventListener('click', this.getEventData);
// return div