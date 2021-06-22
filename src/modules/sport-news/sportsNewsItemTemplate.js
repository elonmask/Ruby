import item from '../../img/sport_news_item.png'

export class SportsNewsItemTemplate {
  constructor(image, [first, second], date) {
    this.image = image;
    this.home = first;
    this.away = second;
    this.date = date;
  }

  render = () =>
    `<div class="news-item banner background flex-container align-bottom" style="background-image:url(${item}); min-width: 250px;">
            <div class="banner-shadow bottom" style="width: 100%">
                <div class="flex-container align-bottom align-justify">
                    <div class="flex-container flex-dir-column">
                        <p class="font small mr" >${this.home.name}</p>
                        <p class="font small mr" >${this.away.name}</p>
                    </div>
                    <div class="flex-container align-bottom">
                      <p class="font small mr" data="${this.date}" style="padding-top: 20px;"></p>
                    </div>
                    <button class="button primary square fa fa-angle-right"></button>
                </div>
            </div>
        </div>`;

}
