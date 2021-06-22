import soccer from '../../img/scoreboard/scoreboardBackgrounds/soccer.png'
import cricket from '../../img/scoreboard/scoreboardBackgrounds/cricket.png'
import golf from '../../img/scoreboard/scoreboardBackgrounds/golf.png'
import tennis from '../../img/scoreboard/scoreboardBackgrounds/tennis.png'
import baseball from '../../img/scoreboard/scoreboardBackgrounds/baseball.png'
import hockey from '../../img/scoreboard/scoreboardBackgrounds/hockey.png'
import basketball from '../../img/scoreboard/scoreboardBackgrounds/basketball.png'
import tableTennis from '../../img/scoreboard/scoreboardBackgrounds/tableTennis.png'
import badminton from '../../img/scoreboard/scoreboardBackgrounds/badminton.png'
import handball from '../../img/scoreboard/scoreboardBackgrounds/handball.png'

export const scoreboardBackgrounds = {
	1: soccer,
	// 3: cricket,
	7: golf,
	5: tennis,
	3: baseball,
	4: hockey,
	2: basketball,
	78: handball,
	20: tableTennis,
	94: badminton,
}

export const sportsScoreboardTitles = {
	20: [1, 2, 3, 4, 5],
	23: ['1th', '2th', '3th', '4th', '5th'],
	5: [1, 2, 3, 'Set', 'Points'],
	2: [1, 2, 'Half', 3, 4, 'T'],
	4: [1, 2, 3, 'T'],
	31: ['1th', '2nd', '3rd'],
	defaultTitles: ['1', '2', '3', 'T'],
}

// export const fromIdToIcons = {
// 	goal: 'c-icon--goal',
// 	cornerKicks: 'c-icon--corner',
// 	yellowCards: 'c-icon--y-card',
// 	redCards: 'c-icon--r-card',
// 	5: 'c-icon--throw-in',
// 	6: 'c-icon--free-kick',
// 	7: 'c-icon--goal-kick',
// 	8: 'c-icon--penalty',
// 	9: 'c-icon--substitution',
// }

export const increaseArrLength = (arr, length) => {
	for (let i = 0; i <= length - 1; i++) {
		if (!arr[i]) {
			arr[i] = {
				homeScore: '',
				awayScore: '',
			}
		}
	}

	return arr
}

export const transformFromTennisData = ({
	periods,
	currentHomeScore,
	currentAwayScore,
	currentGamePoints,
}) => {
	if (periods.length !== 3) {
		increaseArrLength(periods, 3)
	}

	return [
		...periods,
		{
			homeScore: currentHomeScore,
			awayScore: currentAwayScore,
		},
		{
			homeScore: currentGamePoints.homePoints,
			awayScore: currentGamePoints.awayPoints,
		},
	]
}

export const transformFromBasketballData = ({
	periods,
	currentAwayScore,
	currentHomeScore,
}) => {
	if (periods.length !== 4) {
		increaseArrLength(periods, 4)
	}

	const [first, second] = periods

	const home = Number(first.homeScore || '0') + Number(second.homeScore || '0')
	const away = Number(first.awayScore || '0') + Number(second.awayScore || '0')

	periods.splice(2, 0, { homeScore: home, awayScore: away })

	return [
		...periods,
		{
			homeScore: currentHomeScore,
			awayScore: currentAwayScore,
		},
	]
}

export const transformFromSoccerData = ({
	currentAwayScore,
	currentHomeScore,
	soccerStatistics,
}) => {
	const [f, s] = soccerStatistics?.data || [{}, {}]

	const titles = ['cornerKicks', 'redCards', 'yellowCards', 'goal']

	const result = titles.reduce((acc, title) => {
		let homeScore = f[title] || 0
		let awayScore = s[title] || 0

		if (title === 'redCards') {
			homeScore = Number(homeScore) + Number(f.yellowRedCards) || 0
			awayScore = Number(awayScore) + Number(s.yellowRedCards) || 0
		}

		acc[title] = {
			homeScore,
			awayScore,
		}

		return acc
	}, {})

	return {
		...result,
		goal: {
			homeScore: currentHomeScore,
			awayScore: currentAwayScore,
		},
	}
}

export const transformFromIceHockeyData = ({
	periods,
	currentAwayScore,
	currentHomeScore,
}) => {
	if (periods.length < 3) {
		increaseArrLength(periods, 3)
	}

	return [
		...periods,
		{
			homeScore: currentHomeScore,
			awayScore: currentAwayScore,
		},
	]
}

export const transformFromBadmintonData = ({ periods }) => {
	if (periods.length < 3) {
		increaseArrLength(periods, 3)
	}

	return [...periods]
}

export const commonTransformScoresFunction = (
	periods,
	currentAwayScore,
	currentHomeScore
) => {
	let result = []

	result =
		periods?.length < 3
			? increaseArrLength(periods, 3)
			: increaseArrLength([], 3)

	return [
		...result,
		{
			homeScore: currentHomeScore,
			awayScore: currentAwayScore,
		},
	]
}

export const transformPeriodScores = ({
	periodScores,
	currentGamePoints,
	currentAwayScore,
	currentHomeScore,
	soccerStatistics,
	sportId,
}) => {
	const periods = periodScores ? [...periodScores] : []

	switch (sportId) {
		case 5:
			return transformFromTennisData({
				periods,
				currentGamePoints,
				currentAwayScore,
				currentHomeScore,
			})
		case 1: {
			return transformFromSoccerData({
				currentHomeScore,
				currentAwayScore,
				soccerStatistics,
			})
		}
		case 2:
			return transformFromBasketballData({
				periods,
				currentGamePoints,
				currentAwayScore,
				currentHomeScore,
			})
		case 4:
			return transformFromIceHockeyData({
				periods,
				currentAwayScore,
				currentHomeScore,
			})
		case 31:
			return transformFromBadmintonData({
				periods,
			})
		case 20:
		case 23:
			return increaseArrLength(periods, 5)

		default:
			return commonTransformScoresFunction(
				periods,
				currentAwayScore,
				currentHomeScore
			)
	}
}
