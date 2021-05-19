import axios from 'axios'
import Headers from './headers'
import https from 'https'

const host = () => localStorage.getItem('app-api-server-url') || 'api.m3-solutions.io'
const baseURL = () => `https://${host()}/`

export default class HttpWrapper {
  static simpleHttp () {
    return axios.create({
      httpsAgent: new https.Agent({
        rejectUnauthorized: false
      }),
      baseURL: baseURL(),
      headers: Object.assign({}, Headers.simple())
    })
  }

  static accountAndTokenHttp (data = {}) {
    console.log('HttpWrapper:accountAndTokenHttp', baseURL())
    return axios.create({
      httpsAgent: new https.Agent({
        rejectUnauthorized: false
      }),
      baseURL: baseURL(),
      headers: Object.assign({}, Headers.withAccountIdAndToken(), data)
    })
  }

  static tokenOnlyHttp () {
    console.log('HttpWrapper:tokenOnlyHttp', baseURL())
    return axios.create({
      httpsAgent: new https.Agent({
        rejectUnauthorized: false
      }),
      baseURL: baseURL(),
      headers: Object.assign({}, Headers.withAccountIdAndToken())
    })
  }
}
