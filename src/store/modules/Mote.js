import { MOTE_HOST_GATEWAY_IP, MOTE_NETWORK_CONFIG } from '../actions/mote'

const state = {
  mote: {
    moteHostGatewayIp: localStorage.getItem('moteHostGatewayIp') || '',
    moteNetworkConfig: localStorage.getItem('moteNetworkConfig') || {}
  }
}

const getters = {
  moteHostGatewayIp: state => state.mote.moteHostGatewayIp,
  moteNetworkConfig: state => {
    if (Object.keys(state.mote.moteNetworkConfig).length) {
      return JSON.parse(state.mote.moteNetworkConfig)
    }

    return {}
  }
}

const actions = {
  [MOTE_NETWORK_CONFIG]: ({ commit, dispatch }, config) => {
    localStorage.setItem('moteNetworkConfig', JSON.stringify(config))
    commit(MOTE_NETWORK_CONFIG, JSON.stringify(config))
  },
  [MOTE_HOST_GATEWAY_IP]: ({ commit, dispatch }, ipAddress) => {
    localStorage.setItem('moteHostGatewayIp', ipAddress)
    commit(MOTE_HOST_GATEWAY_IP, ipAddress)
  }
}

const mutations = {
  [MOTE_NETWORK_CONFIG]: (state, config) => {
    state.mote.moteNetworkConfig = config
  },
  [MOTE_HOST_GATEWAY_IP]: (state, ipAddress) => {
    state.mote.moteHostGatewayIp = ipAddress
  }
}

export default { state, getters, actions, mutations }
