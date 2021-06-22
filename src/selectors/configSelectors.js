import { config } from '../config/config'

export const isLoggedIn = () => config?.CUSTOMER_CONFIG?.LOGGED_IN
export const getOddsType = () => config?.CUSTOMER_CONFIG?.ODDS_TYPE
export const getUserName = () => config?.CUSTOMER_CONFIG?.USER_NAME
export const getCurrencySymbol = () => config?.CUSTOMER_CONFIG?.CURRENCY_SYMBOL
export const getFullName = () => config?.CUSTOMER_CONFIG?.FULL_NAME
export const getTZ = () => config?.CUSTOMER_CONFIG?.TZ
export const getTZA = () => config?.CUSTOMER_CONFIG?.TZA
export const getTranslation =()=> config?.TRANSLATION


