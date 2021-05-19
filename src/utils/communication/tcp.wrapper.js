/* eslint-disable */
import store from '@/store/index'
const net = require('net')

const TWO_SECONDS = 2000
let commandResponse = ''

let client = null

export function portList () {
  return []
}

export function connect (ipAddress) {
  console.log('tcp-connect', ipAddress)
}

export function disconnect () {
  if (client) {
    client.destroy();
  }
}

const getIpAddress = () => store.getters.deviceTcpConnectionIpAddress
const getTcpPort = () => store.getters.deviceTcpConnectionPort

export function writeToMote (
  command,
  ipAddress = '',
  callback
) {
  try {
    console.log('writeToMote-tcp', getIpAddress(), getTcpPort(), command)
    client = new net.Socket().connect(getTcpPort(), getIpAddress(), function() {
      console.log('Connected to ', getIpAddress(), 'is connected', client);
      _writePostOperation(command, callback)
    });

    client.on('error', (err) => {
      callback({error: true, err})
      client.destroy()
    })
  } catch (err) {
    callback({error: true, err})
  }

}

function _writePostOperation (command, callback) {
  client.write(command, (err) => {
    if (err) {
      callback({error: true, err})
    }
  });

  client.on('data', (data) => {
    commandResponse += data.toString()
    read(callback)
  })

}

function read (callback) {
  if (commandResponse.length > 0) {
    let data = commandResponse
    commandResponse = ''
    client.destroy();
    setTimeout(() => {
      callback(data)
    }, 300)
  }

  client.on('close', (data) => {
    console.log('onClosed', data)
  })
}

function isOpen() {
  return client.connected
}
