import 'swiper/swiper-bundle.css';
import './banner.css'

export class BannerTemplate {
    render = () => {
        return `<div id="bannerContainer" style="height: 195px; width: auto;">
        <!-- Additional required wrapper -->
        <div class="swiper-container" style="height: 100%">
        <div class="swiper-wrapper" id="swiper-cont">
            <!-- Slides -->
            <div class="swiper-slide swiper-slide-active" style="width: 295px; height: 170px; margin-right: 14px;">
            <div class="wn-banner wn-banner--shadow" style="background-image: url('https://a.absolute.bet/noPreprocessedImages/banners/BannerFigma.png');">
            <div class="wn-banner__wrap">
                <div class="text-left full-width">
                    <p class="font font--gold m-b-10">New Customers</p>
                    <p class="font font--white font--20 m-b-10">Open Account Offer</p>
                    <p class="font font--white-alpha-05 m-b-10">Up to $ 25 in Bet Credits</p>
                </div>
                <button class="btn btn--outline btn--h-24 wn-banner__btn" style="    border-width: 1px;
                border-style: solid;" id="join"><span class="font font--gold font--11">Join Now</span></button>
            </div>
        </div>
        
            </div>
            
            <div class="swiper-slide swiper-slide-active" style="width: 295px; height: 170px; margin-right: 14px;">
            <div class="wn-banner wn-banner--shadow" style="background-image: url('https://a.absolute.bet/noPreprocessedImages/banners/BannerEventMoreInfo.png');">
            <div class="wn-banner__wrap">
                <div class="text-left full-width">
                    <p class="font font--gold m-b-10">England Cup</p>
                    <p class="font font--white font--20 m-b-10">Liverpool - Manchester</p>
                    <p class="font font--white-alpha-05 m-b-10">24 nov / 19:00</p>
                </div>
                <button class="btn btn--outline btn--h-24 wn-banner__btn" style="    border-width: 1px;
                border-style: solid;"><span class="font font--gold font--11">More info</span></button>
            </div>
        </div>
        
            </div>
            
            <div class="swiper-slide swiper-slide-active" style="width: 295px; height: 170px; margin-right: 14px;">
            <div class="wn-banner wn-banner--shadow" style="background-image: url('https://a.absolute.bet/noPreprocessedImages/banners/ThreeWayBanner.png'); background-repeat: no-repeat;">
            <div class="wn-banner__wrap">
                <div class="text-center full-width">
                    <p class="font font--gold m-b-10">Euro Cup 2019</p>
                    <p class="font font--white font--20 m-b-10">Arsenal - Madrid</p>
                    <p class="font font--white-alpha-05 m-b-10">19.01.2019</p>
                </div>
                <div class="flex align-middle full-width padding wn-banner__footer">
                    <button class="btn btn--h-32 wn-banner__coff btn-bet"><span class="font font--default-alpha-05">1</span><span class="font">2.17</span></button>
                    <button class="btn btn--h-32 wn-banner__coff btn-bet"><span class="font font--default-alpha-05">x</span><span class="font">2.17</span></button>
                    <button class="btn btn--h-32 wn-banner__coff btn-bet"><span class="font font--default-alpha-05">2</span><span class="font">2.17</span></button>
                </div>
            </div>
        </div>
        
            </div>
            
            <div class="swiper-slide swiper-slide-active" style="width: 295px; height: 170px; margin-right: 14px;">
            <div class="wn-banner wn-banner--shadow" style="background-image: url('https://a.absolute.bet/noPreprocessedImages/banners/bonusOnDeposit.png');">
            <div class="wn-banner__wrap wn-banner__wrap--down">
                <div class="text-left full-width">
                    <p class="font font--gold font--17 text-uppercase">
                        BONUS ON THE 1ST<br />
                        DEPOSIT UP TO
                    </p>
                </div>
            </div>
            <div class="flex align-middle full-width wn-banner__footer">
                <h1 class="h1 h1--gold h1--semibold"><span class="m-r-5" style="color: #f1cb62">3000</span><span class="font font--gold font--16 text-uppercase">Uah</span></h1>
            </div>
        </div>
        
            </div>
            
        </div>
        <!-- If we need pagination -->
        <div class="swiper-pagination"></div>
    
        <!-- If we need scrollbar -->
        <div class="swiper-scrollbar"></div>
        </div>
        </div>`
    }
}
						  
					   