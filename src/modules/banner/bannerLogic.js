// core version + navigation, pagination modules:
import Swiper, { Navigation, Pagination } from 'swiper';
import { getRequestWithoutCredentials } from '../../helpers/utils'
import { registration } from '../registration/registration'

// configure Swiper to use modules
Swiper.use([Navigation, Pagination]);

export class BannerLogic {
    constructor() {
      this.data = null;
    }

    loadBanners = async () => {
      try {
        const data = await getRequestWithoutCredentials('https://api.absolute.bet/config/bannerSlider/')
        this.data = data;
        console.log(this.data)
      } catch (e) {
        console.log(e)
      }
  }
    Banner = (bannerData) => {
      if (bannerData.type == "OPEN_ACCOUNT_OFFER") {
        const htmlString = 
        `
        <div class="swiper-slide swiper-slide-active" style="width: 295px; height: 170px; margin-right: 14px;">
                <div class="wn-banner wn-banner--shadow" style="background-image: url('${bannerData.src}');">
                    <div class="wn-banner__wrap">
                        <div class="text-left full-width">
                            <p class="font font--gold m-b-10">${bannerData.titles.title1}</p>
                            <p class="font font--white font--20 m-b-10">${bannerData.titles.title2}</p>
                            <p class="font font--white-alpha-05 m-b-10">${bannerData.titles.title3}</p>
                        </div>
                        <button class="btn btn--outline btn--h-24 wn-banner__btn" style="border-width: 1px; border-style: solid;" data-join="join"><span class="font font--gold font--11">${bannerData.buttonTitle}</span></button>
                    </div>
                </div>
            </div>
        `
        const container = document.createElement('div');
        container.innerHTML = htmlString.trim();
        return container.firstChild;
      } else if(bannerData.type == "EVENT_MORE_INFO") {
        const htmlString = 
        `
        <div class="swiper-slide swiper-slide-active" style="width: 295px; height: 170px; margin-right: 14px;">
                <div class="wn-banner wn-banner--shadow" style="background-image: url('${bannerData.src}');">
                    <div class="wn-banner__wrap">
                        <div class="text-left full-width">
                            <p class="font font--gold m-b-10">${bannerData.titles.title1}</p>
                            <p class="font font--white font--20 m-b-10">${bannerData.titles.title2}</p>
                            <p class="font font--white-alpha-05 m-b-10">${bannerData.titles.title3}</p>
                        </div>
                        <button class="btn btn--outline btn--h-24 wn-banner__btn" style="border-width: 1px; border-style: solid;" data-join="join"><span class="font font--gold font--11">${bannerData.buttonTitle}</span></button>
                    </div>
                </div>
            </div>
        `
        const container = document.createElement('div');
        container.innerHTML = htmlString.trim();
        return container.firstChild;
      }
    }
    render = async () => {
      document.getElementById("swiper-cont").innerHTML = '';
      this.data.forEach((banner) => {
        document.getElementById("swiper-cont").appendChild(this.Banner(banner))
      })
      new Swiper('.swiper-container', {
        direction: "horizontal",
        spaceBetween: 10,
        slidesPerView: "auto",
        scrollbar: {
            hide: true, 
        },
      
        // If we need pagination
        pagination: {
            el: '.swiper-pagination',
            type: 'bullets',
          },
      
        // And if we need scrollbar
        scrollbar: {
          el: '.swiper-scrollbar',
        },
      }) 
      document.getElementsByClassName('swiper-scrollbar')[0].style.display = 'none'
      /*document.getElementById('join').addEventListener('click', () => {
        registration.init();
      })*/

      console.log("Join buttons: ");
      document.querySelectorAll(`[data-join]`).forEach(el => {
        el.addEventListener('click', () => {
          registration.init();
        })
      })
    }

    init = async () => {
      await this.loadBanners();
      await this.render();
    }
}