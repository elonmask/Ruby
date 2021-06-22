export const getScore = additionalData => additionalData?.scoreboard?.data || {}

export const getCurrentServer = additionalData =>
	additionalData?.currentServer?.data || {}

export const getCompetitorsScore = (sportId, additionalData) => {
	const homeScore = []
	const awayScore = []

	if(sportId === 3 || sportId === 19){
		const { currentAwayScore = 0, currentHomeScore = 0 } = additionalData?.scoreboard?.data || {}

		homeScore.push(currentHomeScore)
		awayScore.push(currentAwayScore)

		return {
			homeScore, awayScore
		}
	}

	const periods = getScore(additionalData).periodScores || []

	periods.forEach(({ awayScore: a, homeScore: h }) => {
		homeScore.push(h)
		awayScore.push(a)
	})

	if (sportId === 5) {
		const { homePoints, awayPoints } =
			getScore(additionalData).currentGamePoints || {}

		homeScore.push(homePoints || 0)
		awayScore.push(awayPoints || 0)
	}

	return {
		homeScore,
		awayScore,
	}
}
