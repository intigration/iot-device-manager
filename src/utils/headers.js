import store from '../store'
import { BrowserChallenge } from './app-identity.util'

 const identity = new BrowserChallenge()

export default class Headers {
  static simple () {
    const customerName = localStorage.getItem('customerName') || 'pspg.m3-solutions.io'
    const appIdentifyChallenge = () => identity.generate()

    return {
      'content-type': 'application/json',
      'Customer': `${customerName}`,
      'Mind-Auth-Challenge': '',
      //  'Browser-Challenge': appIdentifyChallenge(),
      'Cache-Control': 'no-cache'
    }
  }

  static withAccountIdAndToken () {
    return Object.assign({}, this.simple(), this.withToken(), {
      Account_Id: localStorage.getItem('accountId')
    })
  }

  static withToken () {
    return {
      Authorization: `Bearer ${store.getters.accessToken}`
    }
  }
}
