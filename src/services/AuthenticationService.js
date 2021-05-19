import HttpWrapper from '../utils/http.wrapper'

const USER_SERVICES_API_PATH = 'user-services/ctx/v2'

export function login (userCredentialString) {
  return HttpWrapper.simpleHttp().post(
    `${USER_SERVICES_API_PATH}/login`,
    userCredentialString
  )
}

export function fetchGatewayAccountId (serialNumber) {
  return HttpWrapper.tokenOnlyHttp().get(`/gateway-services/auth/v1/box/${serialNumber}/account`)
}

export function logout () {
  return HttpWrapper.accountAndTokenHttp().delete(
    `${USER_SERVICES_API_PATH}/logout`
  )
}
