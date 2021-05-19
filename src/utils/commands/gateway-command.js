/* eslint-disable */

const modulePath = {
  NETWORKING: '/sle/csp/box/networking',
  AUTH: '/sle/csp/box/cspauth',
  CONFIG: '/sle/csp/box/config',
  THREAD: '/com/mentor/sle/csp/fw/threadmanager'
}

export const gatewayCommissioningState = {
  BLOCKED: 0,
  BLANK: 1,
  MANUFACTURED: 2,
  READY: 3,
  OPERATIONAL: 4
}

// Gateway Authentication Engine Commands
export const authentication = {
  injectMat: mat => JSON.stringify({
    Command: 0,
    Module_Path: modulePath.AUTH,
    MAT: mat
  }),

  getStatus: () => JSON.stringify({
    Command: 1,
    Module_Path: modulePath.AUTH
  }),

  killDevice: () => JSON.stringify({
    Command: 2,
    Module_Path: modulePath.AUTH
  }),

  unblock: () => JSON.stringify({
    Command: 3,
    Module_Path: modulePath.AUTH
  })
}

// Gateway Network Configuration Related Commands
export const network = {
  getStatus: () => JSON.stringify({
    Command: 0,
    Module_Path: modulePath.NETWORKING
  }),

  getNetworkConfig: () => JSON.stringify({
    Command: 1,
    Module_Path: modulePath.NETWORKING
  }),

  setNetworkEthDhcp: () => JSON.stringify({
    Command: 2,
    Module_Path: modulePath.NETWORKING,
    Parameters: {
      Connection: "ethernet",
      Type: "dhcp"
    }
  }),

  setNetworkEthStatic: ({
    interface_ip,
    ip_address,
    netmask,
    gateway,
    nameserver = []
  }) => JSON.stringify({
    Command: 2,
    Module_Path: modulePath.NETWORKING,
    Parameters: {
      Connection: "ethernet",
      Type: "static",
      Info: {
        "interface:": interface_ip,
        ip_address,
        netmask,
        gateway,
        nameserver: [...nameserver]
      }
    }
  }),

  setNetworkWiFi: ({SSID, Password}) => JSON.stringify({
    Command: 2,
    Module_Path: modulePath.NETWORKING,
    Parameters: {
      Connection: "wifi",
      Type: "dhcp",
      Info: {
        SSID, Password
      }
    }
  }),

  isWiFiSupported: () => JSON.stringify({
    Command: 3,
    Module_Path: modulePath.NETWORKING,
    Parameters: {
      Type: "wifi"
    }
  }),

  isEthernetSupported: () => JSON.stringify({
    Command: 3,
    Module_Path: modulePath.NETWORKING,
    Parameters: {
      Type: "ethernet"
    }
  })
}

// Gateway Access Point configuration related commands
// Access Point is only supported in Kitra & Artik boards. Due to hardware
export const accessPoint = {
  getAccessPointList: () => JSON.stringify({
    Command: 4,
    Module_Path: modulePath.NETWORKING
  }),

  getAccessPointConfig: () => JSON.stringify({
    Command: 6,
    Module_Path: modulePath.NETWORKING
  }),

  setAccessPoint: ({ssid, channel, password, gatewayIp, ipRange}) => JSON.stringify({
    Command: 7,
    Module_Path: modulePath.NETWORKING,
    Parameters: {
      SSID: ssid,
      Channel: channel,
      Security: {
        Type: "WPA",
        Object: {
          "WPA-TYPE": "WPA-PSK",
          passphrase: password
        }
      },
      DNS: {
        gateway: gatewayIp,
        ip_range: ipRange
      }
    }
  }),

  checkWiFiMode: () => JSON.stringify({
    Command: 5,
    Module_Path: modulePath.NETWORKING,
    Parameters: {}
  }),

  switchOnModeWiFi: () => JSON.stringify({
    Command: 5,
    Module_Path: modulePath.NETWORKING,
    Parameters: {
      Mode: "Master"
    }
  }),

  switchOffModeWiFi: () => JSON.stringify({
    Command: 5,
    Module_Path: modulePath.NETWORKING,
    Parameters: {
      Mode: "Managed"
    }
  })
}

// Signaling proxy
export const signalingProxy = {
  turnOn: () => JSON.stringify({
    Command: 0,
    Module_Path: modulePath.CONFIG,
    Parameters: {
      ENABLE_SIG_PROXY: 1
    }
  }),

  turnOff: () => JSON.stringify({
    Command: 0,
    Module_Path: modulePath.CONFIG,
    Parameters: {
      ENABLE_SIG_PROXY: 0
    }
  }),

  status: () => JSON.stringify({
    Command: 0,
    Module_Path: modulePath.CONFIG
  })
}

// Thread network
// Thread is only supported in Kitra & Artik boards. Due to hardware
export const thread = {
  info: () => JSON.stringify({
    Command: 0,
    Module_Path: modulePath.THREAD
  }),
  setup: ({channel, pan_id, extended_pan_id, global_prefix, ula_prefix, commissioning_mode, radio_power}) => JSON.stringify({
    Command: 1,
    Module_Path: modulePath.THREAD,
    Parameters: {
      thread_enable: '1',
      channel,
      pan_id,
      extended_pan_id,
      global_prefix,
      ula_prefix,
      commissioning_mode,
      radio_power
    }
  }),
  turnOff: ({channel, pan_id, extended_pan_id, global_prefix, ula_prefix, commissioning_mode, radio_power}) => JSON.stringify({
    Command: 1,
    Module_Path: modulePath.THREAD,
    Parameters: {
      thread_enable: '0',
      channel,
      pan_id,
      extended_pan_id,
      global_prefix,
      ula_prefix,
      commissioning_mode,
      radio_power
    }
  })
}

export default {
  authentication,
  network,
  accessPoint
}
