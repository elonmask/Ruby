class StorageEmitter {
	constructor() {
		this.eventStorage = {}
	}

	writeEventToStorage = (name, cb) => {
		if (!this.eventStorage[name]) {
			this.eventStorage[name] = []
		}

		this.eventStorage[name].push(cb)
	}

	triggerCallback = name => {

		if (this.eventStorage[name]) {
			this.eventStorage[name].forEach(cb => cb())
		}
	}

	removeCallback = (name, cb) => {
		this.eventStorage[name] = this.eventStorage[name].filter(
			callback => callback !== cb
		)
	}

	compareStorage = (old, current) => {
		const oldKeys = Object.keys(old)
		oldKeys.forEach(key => {
			if (old[key] !== current[key]) {
				setTimeout(() => {
					this.triggerCallback(key)
				}, 0)
			}
		})
	}
}

export const storageEmitter = new StorageEmitter()
