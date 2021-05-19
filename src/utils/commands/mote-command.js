/* eslint-disable */

export const getNetworkConfigCommand = () => ({ Command: 3 })

export const ethernetDhcpCommand = () => ({
  Command: 4,
  Parameters: { type: 'ethernet' }
})

export const ethernetWifiCommand = ({ ssid, password }) => ({
  Command: 4,
  Parameters: {
    type: 'wifi',
    wifi: { ssid: ssid, password: password, security: 'wpa' }
  }
})

export const brokerAddressUpdateCommand = broker_ip_address => ({
  Command: 6,
  Parameters: { IMDA: { broker_address: broker_ip_address } }
})

export const ethernetStaticCommand = ({
  ip_address,
  netmask,
  gateway,
  dns_0,
  dns_1,
  dns_2
}) => ({
  Command: 4,
  Parameters: {
    static: { ip_address, netmask, gateway, dns_0, dns_1, dns_2 },
    type: 'ethernet'
  }
})

export default {
  getNetworkConfig: getNetworkConfigCommand,
  setNetworkEthDhcp: ethernetDhcpCommand,
  setNetworkEthStatic: ethernetStaticCommand,
  setNetworkWiFi: ethernetWifiCommand,
  setBrokerIP: brokerAddressUpdateCommand
}
