import HttpWrapper from '../utils/http.wrapper'
import store from '../store/index'

const GATEWAY_SERVICES_API_PATH = '/gateway-services/auth/v1'

export async function fetchRandomChallenge (deviceType, serialNumber) {
  return HttpWrapper.accountAndTokenHttp().get(`${GATEWAY_SERVICES_API_PATH}/${deviceType}/${serialNumber}/rnd`)
}

export async function authenticateDevice (moteSerial, rnd, c1) {
  console.log('Rand_1', rnd)
  return HttpWrapper.accountAndTokenHttp({
    challenge: rnd,
    c1
  }).post(
    `${GATEWAY_SERVICES_API_PATH}/peripheral/${moteSerial}/deviceauthenticate`
  )
}

export async function authenticateHost (moteSerial, rnd) {
  console.log('Rand_2', rnd)
  return HttpWrapper.accountAndTokenHttp({
    rnd
  }).post(
    `${GATEWAY_SERVICES_API_PATH}/peripheral/${moteSerial}/hostauthenticate?deviceType=${store.getters.deviceType}`
  )
}

export async function encrypt (moteSerial, data) {
  return HttpWrapper.accountAndTokenHttp({
    data
  }).post(`${GATEWAY_SERVICES_API_PATH}/peripheral/${moteSerial}/encryptdata?deviceType=${store.getters.deviceType}`)
}

export async function decrypt (moteSerial, data) {
  return HttpWrapper.accountAndTokenHttp({
    data
  }).post(`${GATEWAY_SERVICES_API_PATH}/peripheral/${moteSerial}/decryptdata?deviceType=${store.getters.deviceType}`)
}
