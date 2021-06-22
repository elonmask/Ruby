import { SearchTemplate } from '../modules/search/searchTemplate'
import { RightColumnTemplate } from '../modules/rightColumn/rightColumnTemplate'
import { HotNewsTemplate } from '../modules/hot-news/hotNewsTemplate'
import { FavouritesTemplate } from '../modules/favourite/favouriteTemplate'
import { ClassificationTemplate } from '../modules/classification/classificationTemplate'
import { LiveNowTemplate } from '../modules/live-now/liveNowTemplate'
import { LiveNowLogic } from '../modules/live-now/liveNowLogic';
import { SportsNewsTemplate } from '../modules/sport-news/sportsNewsTemplate'
import { TopBetsTemplate } from '../modules/top-bets/topBetsTemplate'
import { PrematchListTemplate } from '../modules/prematch-list/prematchListTemplate'
import { PrematchListLogic } from '../modules/prematch-list/prematchListLogic'
import { PrematchTableTemplate } from '../modules/prematch-table/prematchTableTemplate'
import { HighlightsBetsTemplate } from '../modules/highlights-bets/highlightsBetsTemplate'
import { ClassificationInplayTemplate } from '../modules/classification-inplay/classificationInplayTemplate'
import { UsermenuTemplate } from '../modules/usermenu/usermenuTemplate'
import { UsermenuLogic } from '../modules/usermenu/usermenuLogic'
import { OverviewTemplate } from '../modules/overview/overviewTemplate'
import { EventTemplate } from '../modules/event/eventTemplate'
import { CalendarTemplate } from '../modules/calendar/calendarTemplate'
import { LogoTemplate } from '../modules/logo/logoTemplate'
import { MenuTemplate } from '../modules/menu/menuTemplate'
import { LoginInTemplate } from '../modules/loginIn/loginInTemplate'
import { LoginTemplate } from '../modules/login/loginTemplate'
import { SubHeaderTemplate } from '../modules/subHeader/subHeaderTemplate'
import { AboutTemplate } from '../modules/about/aboutTemplate'
import { PartnerTemplate } from '../modules/partner/partnerTemplate'
import { InfoTemplate } from '../modules/info/infoTemplate'
import { CopyrightTemplate } from '../modules/copyright/copyrightTemplate'
import { ClassificationLogic } from '../modules/classification/classificationLogic'
import { SliderTemplate } from '../modules/slider/sliderTemplate'
import { SliderLogic } from '../modules/slider/sliderLogic'
import { OverviewLogic } from '../modules/overview/overviewLogic'
import { ScoreboardTemplate } from '../modules/scoreboard/scoreboardTemplate'
import { TopBetsLogic } from '../modules/top-bets/topBetsLogic'
import { BetslipLogic } from '../modules/rightColumn/betslip/betslipLogic'
import { BetslipTemplate } from '../modules/rightColumn/betslip/betslipTemplate'
import { MyBetsTemplateAside } from '../modules/rightColumn/myBets/myBetsTemplateAside'
import { MyBetsTemplateAsideLogic } from '../modules/rightColumn/myBets/myBetsTemplateAsideLogic'
import { PrematchTableLogic } from '../modules/prematch-table/prematchTableLogic'
import { RightColumnLogic } from '../modules/rightColumn/rightColumnLogic'
import { EventLogic } from '../modules/event/eventLogic'
import { MarketsTemplate } from '../modules/markets/marketsTemplate'
import { MarketsLogic } from '../modules/markets/marketsLogic'
import { ScoreboardLogic } from '../modules/scoreboard/scoreboardLogic'
import { ClassificationInplayLogic } from '../modules/classification-inplay/classificationInplayLogic'
import { SubHeaderLogic } from '../modules/subHeader/subHeaderLogic'
import { LoginLogic } from '../modules/login/loginLogic'
import { LoginInLogic } from '../modules/loginIn/loginInLogic'
import { MyBetsCenterTemplate } from '../modules/bets-big/myBetsCenterTemplate'
import { MyBetsLogic } from '../modules/bets-big/myBetsLogic'
import { CasinoTemplate } from '../modules/casino/casinoTemplate'
import { CasinoLogic } from '../modules/casino/casinoLogic'
import { SportNewsLogic } from '../modules/sport-news/sportNewsLogic'
import { TranslationTemplate } from '../modules/rightColumn/translation/translationTemplate'
import { TranslationLogic } from '../modules/rightColumn/translation/translationLogic'
import { writeToInstances } from '../storage/instances'
import { BannerTemplate } from '../modules/banner/bannerTemplate'
import { BannerLogic } from '../modules/banner/bannerLogic'

const modulesTemplates = {
	search: { template: SearchTemplate, logic: null },
	rightColumn: {
		template: RightColumnTemplate,
		logic: RightColumnLogic,
	},
	hotNews: { template: HotNewsTemplate, logic: null },
	favourites: { template: FavouritesTemplate, logic: null },
	classification: {
		template: ClassificationTemplate,
		logic: ClassificationLogic,
	},
	liveNow: { template: LiveNowTemplate, logic: LiveNowLogic },
	sportsNews: { template: SportsNewsTemplate, logic: SportNewsLogic },
	topBets: {
		template: TopBetsTemplate,
		logic: TopBetsLogic,
	},
	casino: {
		template: CasinoTemplate,
		logic: CasinoLogic,
	},
	prematchList: { template: PrematchListTemplate, logic: PrematchListLogic },
	prematchTable: { template: PrematchTableTemplate, logic: PrematchTableLogic },
	highlightsBets: { template: HighlightsBetsTemplate, logic: null },
	classificationInplay: {
		template: ClassificationInplayTemplate,
		logic: ClassificationInplayLogic,
	},
	usermenu: { template: UsermenuTemplate, logic: UsermenuLogic },
	overview: {
		template: OverviewTemplate,
		logic: OverviewLogic,
	},
	event: {
		template: EventTemplate,
		logic: EventLogic,
	},
	calendar: { template: CalendarTemplate, logic: null },
	logo: { template: LogoTemplate, logic: null },
	menu: { template: MenuTemplate, logic: null },
	loginIn: {
		template: LoginInTemplate,
		logic: LoginInLogic,
	},
	login: {
		template: LoginTemplate,
		logic: LoginLogic,
	},
	subHeader: {
		template: SubHeaderTemplate,
		logic: SubHeaderLogic,
	},
	about: { template: AboutTemplate, logic: null },
	partner: { template: PartnerTemplate, logic: null },
	info: { template: InfoTemplate, logic: null },
	copyright: { template: CopyrightTemplate, logic: null },
	slider: {
		template: SliderTemplate,
		logic: SliderLogic,
	},
	scoreboard: {
		template: ScoreboardTemplate,
		logic: ScoreboardLogic,
	},
	betslip: {
		template: BetslipTemplate,
		logic: BetslipLogic,
	},
	myBetsAside: {
		template: MyBetsTemplateAside,
		logic: MyBetsTemplateAsideLogic,
	},
	myBetsCenter: {
		template: MyBetsCenterTemplate,
		logic: MyBetsLogic,
	},
	markets: {
		template: MarketsTemplate,
		logic: MarketsLogic,
	},
	translation:{
		template: TranslationTemplate,
		logic: TranslationLogic,
	},
	banner: {
		template: BannerTemplate,
		logic: BannerLogic
	}
}

export const getModule = key => {
	if (!modulesTemplates[key]) {
		return ''
	}

	setTimeout(() => {
		if (modulesTemplates[key].logic) {
			const moduleLogic = new modulesTemplates[key].logic()
			writeToInstances(moduleLogic)
			moduleLogic.init()
		}
	}, 0)

	const moduleTemplate = new modulesTemplates[key].template()
	writeToInstances(moduleTemplate)
	return moduleTemplate.render()
}