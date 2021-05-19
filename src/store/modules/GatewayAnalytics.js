import {
  GW_BE_CONNECTIVITY,
  GW_CPU_MEMORY,
  GW_SYSTEM_DISK,
  GW_CONTAINER_DISK,
  GW_NETWORK_IN_OUT,
  GW_SYSTEM_LOAD
} from '../actions/gateway-analytics'
import { login, logout } from '@/services/AuthenticationService'

const state = {
  gwBeConnectivity: '',
  gwCpuMemory: '',
  gwSystemDisk: '',
  gwContainerDisk: '',
  gwNetworkInOut: '',
  gwSystemLoad: ''
}

const getters = {
  gwBeConnectivity: state => state.gwBeConnectivity,
  gwCpuMemory: state => state.gwCpuMemory,
  gwSystemDisk: state => state.gwSystemDisk,
  gwContainerDisk: state => state.gwContainerDisk,
  gwNetworkInOut: state => state.gwNetworkInOut,
  gwSystemLoad: state => state.gwSystemLoad
}

const actions = {
  [GW_BE_CONNECTIVITY]: ({ commit }, data) => {
    commit(GW_BE_CONNECTIVITY, data)
  },
  [GW_CPU_MEMORY]: ({ commit }, data) => {
    commit(GW_CPU_MEMORY, data)
  },
  [GW_SYSTEM_DISK]: ({ commit }, data) => {
    commit(GW_SYSTEM_DISK, data)
  },
  [GW_CONTAINER_DISK]: ({ commit }, data) => {
    commit(GW_CONTAINER_DISK, data)
  },
  [GW_NETWORK_IN_OUT]: ({ commit }, data) => {
    commit(GW_NETWORK_IN_OUT, data)
  },
  [GW_SYSTEM_LOAD]: ({ commit }, data) => {
    commit(GW_SYSTEM_LOAD, data)
  }
}

const mutations = {
  [GW_BE_CONNECTIVITY]: (state, data) => {
    state.gwBeConnectivity = data
  },
  [GW_CPU_MEMORY]: (state, data) => {
    state.gwCpuMemory = data
  },
  [GW_SYSTEM_DISK]: (state, data) => {
    state.gwSystemDisk = data
  },
  [GW_CONTAINER_DISK]: (state, data) => {
    state.gwContainerDisk = data
  },
  [GW_NETWORK_IN_OUT]: (state, data) => {
    state.gwNetworkInOut = data
  },
  [GW_SYSTEM_LOAD]: (state, data) => {
    state.gwSystemLoad = data
  },
}

export default {
  state,
  getters,
  actions,
  mutations
}
