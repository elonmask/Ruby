export class Timer {
	constructor({ clock, node, periodId }) {
		this.clock = clock
		this.node = node
		this.periodId = periodId

		this.timerId = null
		this.remaining = null
	}

	addZero = value => {
		if (value < 10) {
			return `0${value}`
		}

		return value
	}

	defaultTime = () => {
		const periods = {
			6: 0,
			7: 45,
			41: 90,
			42: 105,
		}

		if (this.periodId?.data === 100) {
			this.destroy()
			return 'Match End'
		}

		const timestamp =
			new Date().getTime() - this.clock.data.currentPeriodStartTimestamp

		const date = timestamp / 1000

		let minutes = '0' + parseInt(date / 60 + (periods[this.periodId?.data] || 0))
		let seconds = '0' + parseInt(date % 60)

		return minutes.substr(-2) + ':' + seconds.substr(-2)
	}

	remainingTime = () => {
		if (this.periodId?.data === 100) {
			this.destroy()
			return 'Match End'
		}

		let { remainingTime, stopped } = this.clock?.data || {}

		if (stopped) {
			if (!remainingTime) {
				return ''
			}

			let [minutes, seconds] = remainingTime.split(':')

			minutes = this.addZero(Number(minutes))

			remainingTime = `${minutes}:${seconds}`

			return remainingTime
		}

		const startedTime = this.remaining || remainingTime

		if (!startedTime) {
			return ''
		}

		let [minutes, seconds] = startedTime.split(':')

		if (Number(minutes) === 0 && Number(seconds) === 0) {
			return '00:00'
		}

		let time = Number(minutes) * 60 + Number(seconds)

		time = time - 1

		let currentMinutes = Math.floor(time / 60)
		let currentSeconds = time - currentMinutes * 60

		currentMinutes = this.addZero(currentMinutes)
		currentSeconds = this.addZero(currentSeconds)

		const timeString = `${currentMinutes}:${currentSeconds}`

		this.remaining = timeString

		return timeString
	}

	start = name => {
		const timerFunc = name === 'default' ? this.defaultTime : this.remainingTime
		this.timerId = setInterval(() => {
			this.node.innerHTML = timerFunc()
		}, 1000)
	}

	init = () => {
		if (this.clock?.data) {
			let timer

			if (this.clock.data.currentPeriodStartTimestamp) {
				timer = 'default'
			}

			if (this.clock.data.remainingTime) {
				timer = 'remaining'
			}

			this.start(timer)
		}
	}

	clearTimerData = () => {
		this.remaining = null
	}

	update = ({ eventClock, periodId }) => {
		this.clock = eventClock
		this.periodId = periodId

		this.clearTimerData()
	}

	destroy = () => {
		clearInterval(this.timerId)
	}
}
