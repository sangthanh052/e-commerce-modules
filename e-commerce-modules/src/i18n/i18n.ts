import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import HOME_EN from '@/locales/en/home.json'
import PRODUCT_EN from '@/locales/en/product.json'
import HOME_VI from '@/locales/vi/home.json'
import PRODUCT_VI from '@/locales/vi/product.json'

export const locales = {
  en: 'English',
  vi: 'Tiếng Việt'
} as const

export const resources = {
  en: {
    home: HOME_EN,
    product: PRODUCT_EN
  },
  vi: {
    home: HOME_VI,
    product: PRODUCT_VI
  }
} as const

export const defaultNS = 'product'

i18n.use(initReactI18next).init({
  resources,
  lng: 'vi', // ngôn ngữ mặc định
  ns: ['home', 'product'], // add những name space sử dụng trong dự án
  fallbackLng: 'vi', // trường hợp không xác định được ngôn ngữ
  defaultNS,
  interpolation: {
    escapeValue: false // react already safes from xss - chống xss
  }
})
