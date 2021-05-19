/* eslint-disable */

import {
  GATEWAY_BACKEND_STATE,
  GATEWAY_STATE,
  GATEWAY_NETWORK_INFO,
  GATEWAY_AUTH_STATE,
  GATEWAY_AP_INFO,
  GATEWAY_AP_MODE_INFO,
  GATEWAY_SIG_PROXY_INFO,
  GATEWAY_THREAD_INFO
} from '../actions/gateway'

const state = {
  gateway: {
    gatewayBackendRetrievedInfo: localStorage.getItem('gatewayBackendRetrievedInfo') || {},
    gatewayDeviceState: localStorage.getItem('gatewayDeviceState') || {},
    gatewayNetworkConfig: localStorage.getItem('gatewayNetworkConfig') || {},
    gatewayAuthState: localStorage.getItem('gatewayAuthState') || {},
    gatewayAccessPointConfig: localStorage.getItem('gatewayAccessPointConfig') || {},
    gatewayAccessPointModeInfo: localStorage.getItem('gatewayAccessPointModeInfo') || {},
    gatewaySigProxyInfo: localStorage.getItem('gatewaySigProxyInfo') || {},
    gatewayThreadInfo: localStorage.getItem('gatewayThreadInfo') || {}
  }
}

const getters = {
  gatewayBackendRetrievedInfo: state => {
    console.log('typeof gatewayBackendRetrievedInfo', typeof state.gateway.gatewayBackendRetrievedInfo)
    if (typeof state.gateway.gatewayBackendRetrievedInfo === 'object') {
      return state.gateway.gatewayBackendRetrievedInfo
    }

    return JSON.parse(state.gateway.gatewayBackendRetrievedInfo)
  },
  gatewayDeviceState: state => {
    console.log('typeof gatewayDeviceState', typeof state.gateway.gatewayDeviceState)
    if (typeof state.gateway.gatewayDeviceState === 'object') {
      return state.gateway.gatewayDeviceState
    }

    return JSON.parse(state.gateway.gatewayDeviceState)
  },
  gatewayNetworkConfig: state => {
    if (typeof state.gateway.gatewayNetworkConfig === 'object') {
      return state.gateway.gatewayNetworkConfig
    }

    return JSON.parse(state.gateway.gatewayNetworkConfig)
  },
  gatewayAuthState: state => {
    if (typeof state.gateway.gatewayAuthState === 'object') {
      return state.gateway.gatewayAuthState
    }

    const responseData = state.gateway.gatewayAuthState || {}
    return JSON.parse(responseData)
  },
  gatewayAccessPointConfig: state => {
    if (typeof state.gateway.gatewayAccessPointConfig === 'object') {
      return state.gateway.gatewayAccessPointConfig
    }

    return JSON.parse(state.gateway.gatewayAccessPointConfig)
  },
  gatewayAccessPointModeInfo: state => {
    if (typeof state.gateway.gatewayAccessPointModeInfo === 'object') {
      return state.gateway.gatewayAccessPointModeInfo
    }

    return JSON.parse(state.gateway.gatewayAccessPointModeInfo)
  },
  gatewaySigProxyInfo: state => {
    if (typeof state.gateway.gatewaySigProxyInfo === 'object') {
      return state.gateway.gatewaySigProxyInfo
    }

    return JSON.parse(state.gateway.gatewaySigProxyInfo)
  },
  gatewayThreadInfo: state => {
    if (typeof state.gateway.gatewayThreadInfo === 'object') {
      return state.gateway.gatewayThreadInfo
    }

    return JSON.parse(state.gateway.gatewayThreadInfo)
  },
}

const actions = {
  [GATEWAY_BACKEND_STATE]: ({ commit }, data) => {
    localStorage.setItem('gatewayBackendRetrievedInfo', JSON.stringify(data))
    commit(GATEWAY_BACKEND_STATE, data)
  },
  [GATEWAY_STATE]: ({ commit }, data) => {
    localStorage.setItem('gatewayDeviceState', JSON.stringify(data))
    commit(GATEWAY_STATE, data)
  },
  [GATEWAY_NETWORK_INFO]: ({ commit }, data) => {
    localStorage.setItem('gatewayNetworkConfig', JSON.stringify(data))
    commit(GATEWAY_NETWORK_INFO, data)
  },
  [GATEWAY_AUTH_STATE]: ({ commit }, data) => {
    localStorage.setItem('gatewayAuthState', JSON.stringify(data))
    commit(GATEWAY_AUTH_STATE, data)
  },
  [GATEWAY_AP_INFO]: ({ commit }, data) => {
    localStorage.setItem('gatewayAccessPointConfig', JSON.stringify(data))
    commit(GATEWAY_AP_INFO, data)
  },
  [GATEWAY_AP_MODE_INFO]: ({ commit }, data) => {
    localStorage.setItem('gatewayAccessPointModeInfo', JSON.stringify(data))
    commit(GATEWAY_AP_MODE_INFO, data)
  },
  [GATEWAY_SIG_PROXY_INFO]: ({ commit }, data) => {
    localStorage.setItem('gatewaySigProxyInfo', JSON.stringify(data))
    commit(GATEWAY_SIG_PROXY_INFO, data)
  },
  [GATEWAY_THREAD_INFO]: ({ commit }, data) => {
    localStorage.setItem('gatewayThreadInfo', JSON.stringify(data))
    commit(GATEWAY_THREAD_INFO, data)
  },
}

const mutations = {
  [GATEWAY_BACKEND_STATE]: (state, data) => {
    state.gateway.gatewayBackendRetrievedInfo = data
  },
  [GATEWAY_STATE]: (state, data) => {
    state.gateway.gatewayDeviceState = data
  },
  [GATEWAY_NETWORK_INFO]: (state, data) => {
    state.gateway.gatewayNetworkConfig = data
  },
  [GATEWAY_AUTH_STATE]: (state, data) => {
    state.gateway.gatewayAuthState = data
  },
  [GATEWAY_AP_INFO]: (state, data) => {
    state.gateway.gatewayAccessPointConfig = data
  },
  [GATEWAY_AP_MODE_INFO]: (state, data) => {
    state.gateway.gatewayAccessPointModeInfo = data
  },
  [GATEWAY_SIG_PROXY_INFO]: (state, data) => {
    state.gateway.gatewaySigProxyInfo = data
  },
  [GATEWAY_THREAD_INFO]: (state, data) => {
    state.gateway.gatewayThreadInfo = data
  },
}

export default {
  state, getters, actions, mutations
}
