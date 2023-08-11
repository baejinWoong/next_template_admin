import { atom } from 'recoil'
import { alertModalState, confirmModalState, loaderModalState, multiAuthUserInfoState, tabActiveState, tableState, typeInfoState } from './defaultValue'

export const ExampleState = atom({
  key: 'Example',
  default: false,
})

export const alertModalRecoil = atom({
  key: 'alertModalState',
  default: alertModalState,
})

export const confirmModalRecoil = atom({
  key: 'confirmModalState',
  default: confirmModalState,
})

export const loaderModalRecoil = atom({
  key: 'loaderModalState',
  default: loaderModalState,
})

export const tableRecoil = atom({
  key: 'tableState',
  default: tableState,
})

export const tabActiveRecoil = atom({
  key: 'tabActiveState',
  default: tabActiveState,
})

export const multiAuthUserInfoRecoil = atom({
  key: 'multiAuthUserInfoState',
  default: multiAuthUserInfoState,
})

export const typeInfoRecoil = atom({
  key: 'typeInfoState',
  default: typeInfoState,
})
