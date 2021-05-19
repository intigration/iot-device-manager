/* eslint-disable */

import store from '../../../store/index'
import { encrypt, decrypt } from '../../../services/AoimAuthService'
// import { writeToMote } from '../../../utils/serialport.wrapper'
import { mixinProtocol } from '../../../utils/communication/protocol'
import { authentication, network, accessPoint, signalingProxy, thread } from '../../../utils/commands/gateway-command'
import {
  GATEWAY_STATE,
  GATEWAY_NETWORK_INFO,
  GATEWAY_AUTH_STATE,
  GATEWAY_AP_INFO,
  GATEWAY_AP_MODE_INFO,
  GATEWAY_SIG_PROXY_INFO,
  GATEWAY_THREAD_INFO
} from '../../../store/actions/gateway'
import { DEVICE_SERIAL_COMMUNICATION_LOCK } from '@/store/actions/device'

const deviceSerial = () => store.getters.deviceSerialNumber
const deviceComPort = () => store.getters.deviceComPortName
const deviceIpAddress = () => store.getters.deviceTcpConnectionIpAddress
const connectionProtocol = () => store.getters.deviceConnectionProtocol

const connectionIdentifier = () => {
  if (connectionProtocol() === 'TCP') {
    return deviceIpAddress()
  } else {
    return deviceComPort()
  }
}

const lockSerialCommunication = () => store.dispatch(DEVICE_SERIAL_COMMUNICATION_LOCK, true)
const unlockSerialCommunication = () => store.dispatch(DEVICE_SERIAL_COMMUNICATION_LOCK, false)

const formatResponseIfCspAuthModule = (jsonResponse) => Object.assign({}, {Parameters: {state: Number(jsonResponse.state)}})

const writeToMoteAndStoreDecryptedResponse = (command, comPort, storeAction = undefined) => {
  return new Promise((resolve, reject) => {
    try {
      mixinProtocol(connectionProtocol()).writeToMote(command, comPort, response => {
        if (typeof response === 'object' && response.error) {
          alert(response.err.message)
          unlockSerialCommunication()
          return
        }

        decrypt(deviceSerial(), response)
          .then(resp => {
            const { Response, Parameters } = JSON.parse(resp.data.data)

            if (Response === 1) {
              unlockSerialCommunication()
              return reject(Parameters)
            }

            // FIXME: Work around for auth commands because their response body is totally different
            // FIXME: from all other commands
            if (storeAction === GATEWAY_AUTH_STATE && Parameters === undefined) {
              const authResponse = formatResponseIfCspAuthModule(JSON.parse(resp.data.data))
              storeAction ? store.dispatch(storeAction, authResponse.Parameters) : ''
            } else {
              storeAction ? store.dispatch(storeAction, Parameters) : ''
            }

            resolve({status: true, response: Parameters})
          })
          .catch(e => {
            unlockSerialCommunication()
            // alert(JSON.stringify(e.message))
            console.log('Request Error', e)
          })
      })
    } catch (e) {
      reject(e)
    }
  });
}

export const fetchGatewayStatus = async () => {
  const encryptRequest = await encrypt(deviceSerial(), network.getStatus())
  const command = encryptRequest.data.data
  await writeToMoteAndStoreDecryptedResponse(command, connectionIdentifier(), GATEWAY_STATE)
}

export const fetchNetworkConfig = async () => {
  const encryptRequest = await encrypt(deviceSerial(), network.getNetworkConfig())
  const command = encryptRequest.data.data
  await writeToMoteAndStoreDecryptedResponse(command, connectionIdentifier(), GATEWAY_NETWORK_INFO)
}

export const fetchGatewayWiFiMode = async () => {
  const encryptRequest = await encrypt(deviceSerial(), accessPoint.checkWiFiMode())
  const command = encryptRequest.data.data
  await writeToMoteAndStoreDecryptedResponse(command, connectionIdentifier(), GATEWAY_AP_MODE_INFO)
}

export const fetchAccessPointConfig = async () => {
  const encryptRequest = await encrypt(deviceSerial(), accessPoint.getAccessPointConfig())
  const command = encryptRequest.data.data
  await writeToMoteAndStoreDecryptedResponse(command, connectionIdentifier(), GATEWAY_AP_INFO)
}

export const fetchCommissioningState = async () => {
  const encryptRequest = await encrypt(deviceSerial(), authentication.getStatus())
  const command = encryptRequest.data.data
  await writeToMoteAndStoreDecryptedResponse(command, connectionIdentifier(), GATEWAY_AUTH_STATE)
}

export const turnOnWiFiMode = async () => {
  const encryptRequest = await encrypt(deviceSerial(), accessPoint.switchOnModeWiFi())
  const command = encryptRequest.data.data
  await writeToMoteAndStoreDecryptedResponse(command, connectionIdentifier(), GATEWAY_AP_MODE_INFO)
}

export const turnOffWiFiMode = async () => {
  const encryptRequest = await encrypt(deviceSerial(), accessPoint.switchOffModeWiFi())
  const command = encryptRequest.data.data
  await writeToMoteAndStoreDecryptedResponse(command, connectionIdentifier(), GATEWAY_AP_MODE_INFO)
}

export const fetchSignalingProxyStatus = async () => {
  const encryptRequest = await encrypt(deviceSerial(), signalingProxy.status())
  const command = encryptRequest.data.data
  await writeToMoteAndStoreDecryptedResponse(command, connectionIdentifier(), GATEWAY_SIG_PROXY_INFO)
}

export const switchOnSignalingProxy = async () => {
  const encryptRequest = await encrypt(deviceSerial(), signalingProxy.turnOn())
  const command = encryptRequest.data.data
  await writeToMoteAndStoreDecryptedResponse(command, connectionIdentifier(), GATEWAY_SIG_PROXY_INFO)
}

export const switchOffSignalingProxy = async () => {
  const encryptRequest = await encrypt(deviceSerial(), signalingProxy.turnOff())
  const command = encryptRequest.data.data
  await writeToMoteAndStoreDecryptedResponse(command, connectionIdentifier(), GATEWAY_SIG_PROXY_INFO)
}

export const fetchThreadInfo = async () => {
  const encryptRequest = await encrypt(deviceSerial(), thread.info())
  const command = encryptRequest.data.data
  await writeToMoteAndStoreDecryptedResponse(command, connectionIdentifier(), GATEWAY_THREAD_INFO)
}

// Following methods used by components
// specially following methods contains te chain of operations

export const fetchAllGatewayConfigs = async () => {
  try {
    lockSerialCommunication()
    await fetchGatewayStatus()
    await fetchNetworkConfig()
    // await fetchAccessPointConfig() // only supported in Artik & Kitra
    await fetchCommissioningState()
    // await fetchGatewayWiFiMode() // this command failed due to AP is not in sematic ipc
    await fetchSignalingProxyStatus()
    // await fetchThreadInfo() // only supported in Artik & Kitra
    unlockSerialCommunication()
  } catch (e) {
    unlockSerialCommunication()
    console.log('Error in chain', e)
  }
}

export const applyNetworkDhcp = async (notify, isTcp) => {
  const encryptRequest = await encrypt(deviceSerial(), network.setNetworkEthDhcp())
  const command = encryptRequest.data.data

  lockSerialCommunication()

  const resp = await writeToMoteAndStoreDecryptedResponse(command, connectionIdentifier())

  const { response } = resp

  notify.info({
    title: 'Success',
    message: response['Reason'] || 'DHCP configurations were applied successfully'
  })

  if (isTcp) {
    unlockSerialCommunication()
    return
  }

  await fetchGatewayStatus()
  await fetchNetworkConfig()

  unlockSerialCommunication()
}

export const applyNetworkStatic = async (params, notify, isTcp) => {

  try {
    const encryptRequest = await encrypt(deviceSerial(), network.setNetworkEthStatic({...params}))
    const command = encryptRequest.data.data

    lockSerialCommunication()
    const resp = await writeToMoteAndStoreDecryptedResponse(command, connectionIdentifier())

    const { response } = resp

    notify.info({
      title: 'Success',
      message: response['Reason'] || 'DHCP configurations were applied successfully'
    })

    if (isTcp) {
      unlockSerialCommunication()
      return
    }

    await fetchGatewayStatus()
    await fetchNetworkConfig()

    unlockSerialCommunication()
  } catch (e) {
    unlockSerialCommunication()
    notify.error({
      title: 'Error',
      message: e.Reason || 'Just got failed with applying static config'
    });
  }
}

export const applyNetworkWiFi = async (params, notify) => {
  try {
    const encryptRequest = await encrypt(deviceSerial(), network.setNetworkWiFi({...params}))
    const command = encryptRequest.data.data

    lockSerialCommunication()
    await writeToMoteAndStoreDecryptedResponse(command, connectionIdentifier())

    notify.success({
      title: 'Success',
      message: 'Wireless configurations were applied successfully'
    });

    await fetchGatewayStatus()
    await fetchNetworkConfig()
    unlockSerialCommunication()
  } catch (e) {
    notify.error({
      title: 'Error',
      message: e.Reason || 'Just got failed with applying static config'
    });
    unlockSerialCommunication()
  }
}

export const applyAccessPointSettings = async (params, notify) => {
  try {
    const encryptRequest = await encrypt(deviceSerial(), accessPoint.setAccessPoint({...params}))
    const command = encryptRequest.data.data

    lockSerialCommunication()
    await writeToMoteAndStoreDecryptedResponse(command, connectionIdentifier())
    notify.success({
      title: 'Success',
      message: 'Access point settings were applied successfully; enabling router'
    });
    await turnOnWiFiMode()
    await fetchGatewayStatus()
    notify.success({
      title: 'Success',
      message: 'Access Point is ready to use'
    });
    unlockSerialCommunication()
  } catch (e) {
    notify.error({
      title: 'Error',
      message: e.Reason || 'Just got failed with applying access point settings'
    });
    unlockSerialCommunication()
  }
}

export const turnOffAccessPoint = async (notify) => {
  try {
    lockSerialCommunication()
    await turnOffWiFiMode()
    await fetchGatewayStatus()
    notify.success({
      title: 'Success',
      message: 'Access Point is turned Off'
    });
    unlockSerialCommunication()
  } catch (e) {
    notify.error({
      title: 'Error',
      message: e.Reason || 'Failed to '
    });
    unlockSerialCommunication()
  }
}

export const turnOffSignalingProxy = async (notify) => {
  try {
    lockSerialCommunication()
    await switchOffSignalingProxy()
    // await fetchSignalingProxyStatus()
    notify.success({
      title: 'Success',
      message: 'Signaling proxy is turned Off'
    });
    unlockSerialCommunication()
  } catch (e) {
    notify.error({
      title: 'Error',
      message: e.Reason || 'Failed to '
    });
    unlockSerialCommunication()
  }
}

export const turnOnSignalingProxy = async (notify) => {
  try {
    lockSerialCommunication()
    await switchOnSignalingProxy()
    // await fetchSignalingProxyStatus()
    notify.success({
      title: 'Success',
      message: 'Signaling proxy is turned On'
    });
    unlockSerialCommunication()
  } catch (e) {
    notify.error({
      title: 'Error',
      message: e.Reason || 'Failed to '
    });
    unlockSerialCommunication()
  }
}