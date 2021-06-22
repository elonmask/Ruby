import { findNode, getRequest } from '../../helpers/utils'
import { writeToStorage } from "../../storage/storageMethod";
import { links } from "../../links/links";
import { SportCategory } from "./sportCategory/sportCategory";
import { config } from "../../config/config";

export class ClassificationLogic {
  constructor() {
    this.container = null;
    this.data = [];
    this.url = links.prematchAll;
  }

  init = () => {
    this.container = document.getElementById("classification_container");
    this.loadData();
  };

  loadData = async () => {
    try {
      const data = await getRequest(this.url);
      this.data = data;

      writeToStorage("prematchAll", data);
      this.drawData();
    } catch (e) {
      console.log(e);
    }
  };

  drawData = () => {
    this.container.innerHTML = `
    <div class="classification__category" id="home">
    <div class="classification__category_content" style="padding-left: 0; padding-right: 0">
    <div class="button-left flex-container align-center">
    <i class="fa fa-home" aria-hidden="true" style="margin-right: 15px; margin-left: 7px; font-size: 20px"></i>
            <p class="font">Home</p>
<!--                <button class="watch"></button>-->
          </div>
          </div>
          </div>
    `;

    findNode('#', 'home', this.container).addEventListener('click', (ev) => {
      window.location = './#/sports/';
    })

    this.data.map((sport) => {
    //  console.log(sport)
      if (!config.EX_SPORTS.includes(sport.id)) {
        const sportItem = new SportCategory(sport);
        this.container.append(sportItem.render());
      }
    });

  };
}
