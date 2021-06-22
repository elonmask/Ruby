import { storage } from './storage'
import { storageEmitter } from './storageEmmiter'
import { initialStorageData } from './initialStorageData'
import {
	lightButton,
	saveDataToSessionStorage,
} from './nodes/betButtonsStorage'

export const writeToStorage = (key, data) => {
	const oldStorage = { ...storage }
	storage[key] = data
	storageEmitter.compareStorage(oldStorage, storage)
}

export const writeToStorageWithoutUpdate = (key, data) => {
	storage[key] = data
}

export const getFromStorage = key => {
	return storage[key]
}

export const initStorage = async () => {
	for await (const { key, value, cb } of initialStorageData) {
		writeToStorage(key, value)
		if (cb) {
			for await (let callback of cb) {
				await callback()
			}
		}
	}
}

export const initialSubscription = () => {
	storageEmitter.writeEventToStorage('userStakes', lightButton)
	storageEmitter.writeEventToStorage('userStakes', saveDataToSessionStorage)
}
