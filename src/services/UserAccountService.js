import HttpWrapper from '@/utils/http.wrapper'

const USER_SERVICES_API_PATH = 'user-services/ctx/v2'

export function userAccounts (userId) {
  return HttpWrapper.tokenOnlyHttp().get(
    `${USER_SERVICES_API_PATH}/users/${userId}/accounts`
  )
}
