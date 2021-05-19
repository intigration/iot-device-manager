import HttpWrapper from '../utils/http.wrapper'

const PACKAGE_STATUS = '/analytics-services/gateways/v2/status'
const PACKAGE_MONITORING = '/analytics-services/device/v2/monitor'
const FILTER = 'showPublicResources=true'

export async function fetchStatusHistory (gatewaySerial) {
  return HttpWrapper.accountAndTokenHttp().get(
    `${PACKAGE_STATUS}/history/${gatewaySerial}?period=day&${FILTER}`
  )
}

export async function fetchCpuMemoryUsage (gatewayId) {
  return HttpWrapper.accountAndTokenHttp().get(
    `${PACKAGE_MONITORING}/cpu/memory/gateway/${gatewayId}?date=lastFiveMinutes&${FILTER}`
  )
}

export async function fetchNetworkUsage (gatewayId) {
  return HttpWrapper.accountAndTokenHttp().get(
    `${PACKAGE_MONITORING}/network/gateway/${gatewayId}?date=lastFiveMinutes&${FILTER}`
  )
}

export async function fetchDiskUsage (gatewayId) {
  return HttpWrapper.accountAndTokenHttp().get(
    `${PACKAGE_MONITORING}/disk/gateway/${gatewayId}?date=lastFiveMinutes&${FILTER}`
  )
}

export async function fetchSystemLoad (gatewayId) {
  return HttpWrapper.accountAndTokenHttp().get(
    `${PACKAGE_MONITORING}/load/gateway/${gatewayId}?date=lastFiveMinutes&${FILTER}`
  )
}
