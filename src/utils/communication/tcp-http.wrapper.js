/* eslint-disable */
import store from '@/store/index'
import axios from 'axios'
import https from 'https'

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

const http = () => axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false
  }),
  timeout: 30000,
  baseURL: `http://${getIpAddress()}:${getTcpPort()}/`,
  headers: {
    'Content-Type': 'application/text'
  }
})

export async function writeToMote (command, ipAddress = '', callback ) {
  try {
    const resp = await http().post('/v1.0/command', command)
    callback(JSON.stringify(resp.data))
  } catch(err) {
    callback({error: true, err})
  }
}
