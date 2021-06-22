export const links = {
	inplayTree: `https://api.ruby.bet/feed/?key=inplay-tree&ln=${ typeof localStorage.getItem('lang') === "undefined" ? 1 : localStorage.getItem('lang') == "en" ? 1 : 2 }`,
	event: `https://api.ruby.bet/feed/?key=event&ln=${typeof localStorage.getItem('lang') === "undefined" ? 1 : localStorage.getItem('lang') == "en" ? 1 : 2}&eventId=`,
	league: `https://api.ruby.bet/feed/?key=inplay-league&ln=${typeof localStorage.getItem('lang') === "undefined" ? 1 : localStorage.getItem('lang') == "en" ? 1 : 2}&leagueId=`,
	prematchLeague: `https://api.ruby.bet/feed/?key=league&ln=${typeof localStorage.getItem('lang') === "undefined" ? 1 : localStorage.getItem('lang') == "en" ? 1 : 2}&leagueId=`,
	prematchAll: `https://api.ruby.bet/feed/?key=sports&ln=${typeof localStorage.getItem('lang') === "undefined" ? 1 : localStorage.getItem('lang') == "en" ? 1 : 2}`,
	refreshslip: 'https://api.ruby.bet/bets/refreshslip',
	addBet: 'https://api.ruby.bet/bets/addbet',
	placeBet: 'https://api.ruby.bet/bets/placebet',
	removeBet: 'https://api.ruby.bet/bets/removebet',
	removeAll: 'https://api.ruby.bet/bets/removeall',
	config: 'https://api.ruby.bet/account/config',
	registration: 'https://api.ruby.bet/account/create',
	login: 'https://api.ruby.bet/account/login',
	logout: 'https://api.ruby.bet/account/logout',
	balance: 'https://api.ruby.bet/balance/get/',
	all: 'https://api.ruby.bet/mybets/?type=3',
	settled: 'https://api.ruby.bet/mybets/?type=2 ',
	unsettled: 'https://api.ruby.bet/mybets/?type=1',
	topGames: `https://api.absolute.bet/feed/?key=top-games&ln=${typeof localStorage.getItem('lang') === "undefined" ? 1 : localStorage.getItem('lang') == "en" ? 1 : 2}`,
	matchLiveAnimation:
		'https://href.li/?https://cs.betradar.com/ls/widgets/?/favbet/ru/page/widgets_lmts#matchId=',
	matchLiveStreaming:'https://api.ruby.bet/video/',
	oddTypes: `https://api.absolute.bet/feed/?key=odd-types&ln=${typeof localStorage.getItem('lang') === "undefined" ? 1 : localStorage.getItem('lang') == "en" ? 1 : 2}`
}

