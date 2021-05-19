/* eslint-disable */
import store from '@/store/index'

import * as serialProtocol from './serial.wrapper'
import * as tcpRawProtocol from './tcp.wrapper'
import * as tcpHttpProtocol from './tcp-http.wrapper'

const protocols = {
  TCP: 'TCP',
  SERIAL: 'SERIAL',
  HTTP: 'HTTP'
}

export const mixinProtocol = (protocol) => {
  if (protocol === protocols.SERIAL) {
    return serialProtocol
  }

  if (protocol === protocols.TCP) {
    return tcpRawProtocol
  }

  return tcpHttpProtocol
}
