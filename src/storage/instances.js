export let instances = []

export const destroyInstances = () => {
	instances.forEach(instance => {
		if (instance.destroy) {
			instance.destroy()
			instance = null
		}
	})
	instances = []
}

export const writeToInstances = instance => {
	instances.push(instance)
}
export const destroyByType = type => {
	instances = instances.filter(instance => {
		if (instance.type !== type) {
			return instance
		}

		instance.destroy()
	})
}
