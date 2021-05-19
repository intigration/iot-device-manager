import {
  DEVICE_SERIAL_NUMBER,
  DEVICE_TYPE,
  DEVICE_COM_PORT_NAME,
  DEVICE_STATE_CONNECTED,
  AOIM_INITIAL_RANDOM_CHALLENGE,
  DEVICE_SERIAL_COMMUNICATION_LOCK,
  DEVICE_IP_ADDRESS,
  DEVICE_TCP_PORT,
  DEVICE_CONNECTION_PROTOCOL
} from '@/store/actions/device'

const state = {
  device: {
    serial: localStorage.getItem('deviceSerialNumber') || '',
    deviceType: localStorage.getItem('deviceType') || '',
    portName: localStorage.getItem('deviceComPortName') || '',
    deviceStateConnected: localStorage.getItem('deviceStateConnected') || 'false',
    aoimInitialRandomChallenge: localStorage.getItem('aoimInitialRandomChallenge') || '',
    deviceSerialCommunicationLock: false,
    deviceTcpConnectionIpAddress: localStorage.getItem('deviceTcpConnectionIpAddress') || '',
    deviceTcpConnectionPort: localStorage.getItem('deviceTcpConnectionPort') || '',
    deviceConnectionProtocol: 'TCP'
  }
}

const getters = {
  deviceSerialNumber: state => state.device.serial,
  deviceType: state => state.device.deviceType,
  deviceComPortName: state => state.device.portName,
  deviceStateConnected: state => state.device.deviceStateConnected,
  aoimInitialRandomChallenge: state => state.device.aoimInitialRandomChallenge,
  deviceSerialCommunicationLock: state => state.device.deviceSerialCommunicationLock,
  deviceTcpConnectionIpAddress: state => state.device.deviceTcpConnectionIpAddress,
  deviceTcpConnectionPort: state => state.device.deviceTcpConnectionPort,
  deviceConnectionProtocol: state => state.device.deviceConnectionProtocol
}

const actions = {
  [DEVICE_SERIAL_NUMBER]: ({ commit, dispatch }, serialNumber) => {
    localStorage.setItem('deviceSerialNumber', serialNumber)
    commit(DEVICE_SERIAL_NUMBER, serialNumber)
  },
  [DEVICE_TYPE]: ({ commit, dispatch }, deviceType) => {
    localStorage.setItem('deviceType', deviceType)
    commit(DEVICE_TYPE, deviceType)
  },
  [DEVICE_COM_PORT_NAME]: ({ commit, dispatch }, portName) => {
    localStorage.setItem('deviceComPortName', portName)
    commit(DEVICE_COM_PORT_NAME, portName)
  },
  [DEVICE_STATE_CONNECTED]: ({ commit, dispatch }, config) => {
    localStorage.setItem('deviceStateConnected', config)
    commit(DEVICE_STATE_CONNECTED, JSON.stringify(config))
  },
  [AOIM_INITIAL_RANDOM_CHALLENGE]: ({ commit, dispatch }, randomChallenge) => {
    localStorage.setItem('aoimInitialRandomChallenge', randomChallenge)
    commit(AOIM_INITIAL_RANDOM_CHALLENGE, randomChallenge)
  },
  [DEVICE_SERIAL_COMMUNICATION_LOCK]: ({ commit }, flag) => {
    commit(DEVICE_SERIAL_COMMUNICATION_LOCK, flag)
  },
  [DEVICE_IP_ADDRESS]: ({ commit }, ipAddress) => {
    localStorage.setItem('deviceTcpConnectionIpAddress', ipAddress)
    commit(DEVICE_IP_ADDRESS, ipAddress)
  },
  [DEVICE_TCP_PORT]: ({ commit }, tcpPort) => {
    localStorage.setItem('deviceTcpConnectionPort', tcpPort)
    commit(DEVICE_TCP_PORT, tcpPort)
  },
  [DEVICE_CONNECTION_PROTOCOL]: ({ commit }, protocol) => {
    commit(DEVICE_CONNECTION_PROTOCOL, protocol)
  }
}

const mutations = {
  [DEVICE_SERIAL_NUMBER]: (state, serialNumber) => {
    state.device.serial = serialNumber
  },
  [DEVICE_TYPE]: (state, deviceType) => {
    state.device.deviceType = deviceType
  },
  [DEVICE_COM_PORT_NAME]: (state, portName) => {
    state.device.portName = portName
  },
  [DEVICE_STATE_CONNECTED]: (state, config) => {
    state.device.deviceStateConnected = config
  },
  [AOIM_INITIAL_RANDOM_CHALLENGE]: (state, config) => {
    state.device.aoimInitialRandomChallenge = config
  },
  [DEVICE_SERIAL_COMMUNICATION_LOCK]: (state, flag) => {
    state.device.deviceSerialCommunicationLock = flag
  },
  [DEVICE_IP_ADDRESS]: (state, ipAddress) => {
    state.device.deviceTcpConnectionIpAddress = ipAddress
  },
  [DEVICE_TCP_PORT]: (state, tcpPort) => {
    state.device.deviceTcpConnectionPort = tcpPort
  },
  [DEVICE_CONNECTION_PROTOCOL]: (state, protocol) => {
    state.device.deviceConnectionProtocol = protocol
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
