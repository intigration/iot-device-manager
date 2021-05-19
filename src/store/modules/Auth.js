import {
  AUTH_REQUEST,
  AUTH_ERROR,
  AUTH_SUCCESS,
  AUTH_LOGOUT,
  USER_ACCOUNT,
  APP_API_SERVER,
  RECENT_LOGIN_USERNAME,
  RECENT_LOGIN_CUSTOMER
} from '@/store/actions/auth'
import { login, logout } from '@/services/AuthenticationService'

const state = {
  appApiServerUrl: localStorage.getItem('app-api-server-url') || 'api.m3-solutions.io',
  recentCustomer: localStorage.getItem('app-login-customer') || '',
  recentUsername: localStorage.getItem('app-login-username') || '',
  token: localStorage.getItem('access-token') || '',
  tokenExpiry: localStorage.getItem('tokenExpiry') || '',
  userInfo: {
    id: localStorage.getItem('id') || '',
    firstName: localStorage.getItem('firstName') || '',
    lastName: localStorage.getItem('lastName') || '',
    userName: localStorage.getItem('userName') || '',
    email: localStorage.getItem('email') || '',
    idDadmin: localStorage.getItem('dadmin') || ''
  },
  userAccount: {
    accountId: localStorage.getItem('accountId') || '',
    accountName: localStorage.getItem('accountName') || '',
    accounts: []
  },
  status: '',
  hasLoadedOnce: false
}

const getters = {
  appApiServerUrl: (state) => state.appApiServerUrl,
  recentCustomer: (state) => state.recentCustomer,
  recentUsername: (state) => state.recentUsername,
  userInfo: (state) => state.userInfo,
  userAccountId: (state) => state.userAccount.accountId,
  accessToken: (state) => state.token,
  accessTokenExpiry: (state) => state.tokenExpiry,
  isAuthenticated: (state) => {
    console.log('inside of isAuthenticated method')
    const currentTime = new Date()

    if (!state.token || !state.tokenExpiry) {
      return false
    }

    console.log(currentTime.getTime() >= state.tokenExpiry)

    if (currentTime.getTime() >= state.tokenExpiry) {
      localStorage.clear()
      console.log('token expired')
      return false
    }

    return true
  }
}

const actions = {
  [APP_API_SERVER]: ({ commit }, serverUrl) => {
    localStorage.setItem('app-api-server-url', serverUrl)
    commit(APP_API_SERVER, serverUrl)
  },
  [RECENT_LOGIN_CUSTOMER]: ({ commit }, customerDomain) => {
    localStorage.setItem('app-login-customer', customerDomain)
    commit(RECENT_LOGIN_CUSTOMER, customerDomain)
  },
  [RECENT_LOGIN_USERNAME]: ({ commit }, username) => {
    localStorage.setItem('app-login-username', username)
    commit(RECENT_LOGIN_USERNAME, username)
  },
  [AUTH_REQUEST]: ({ commit, dispatch }, user) => {
    return new Promise((resolve, reject) => {
      commit(AUTH_REQUEST)
      login(user)
        .then(({ data }) => {
          localStorage.setItem('access-token', data.accessToken)
          localStorage.setItem('firstName', data.firstName)
          localStorage.setItem('lastName', data.lastName)
          localStorage.setItem('id', data.id)
          localStorage.setItem('userName', data.userName)
          localStorage.setItem('tokenExpiry', data.expirationDate)
          localStorage.setItem('email', data.email)
          localStorage.setItem('idDadmin', data.dadmin)

          commit(AUTH_SUCCESS, data)
          resolve(data)
        })
        .catch(err => {
          commit(AUTH_ERROR, err)
          localStorage.removeItem('access-token')
          reject(err)
        })
    })
  },
  [AUTH_LOGOUT]: ({ commit }) => {
    return new Promise((resolve, reject) => {
      commit(AUTH_LOGOUT)
      logout()
        .then(resp => resolve(resp))
        .catch(error => reject(error))
    })
  },
  [USER_ACCOUNT]: ({ commit }, accountId) => {
    localStorage.setItem('accountId', accountId)
    commit(USER_ACCOUNT, accountId)
  }
}

const mutations = {
  [APP_API_SERVER]: (state, serverUrl) => {
    state.appApiServerUrl = serverUrl
  },
  [RECENT_LOGIN_USERNAME]: (state, username) => {
    state.recentUsername = username
  },
  [RECENT_LOGIN_CUSTOMER]: (state, customerDomain) => {
    state.recentCustomer = customerDomain
  },
  [AUTH_REQUEST]: (state) => {
    state.status = 'loading'
  },
  [AUTH_SUCCESS]: (state, data) => {
    state.token = data.accessToken
    state.tokenExpiry = data.expirationDate
    state.userInfo.status = 'success'
    state.userInfo.firstName = data.firstName
    state.userInfo.lastName = data.lastName
    state.userInfo.id = data.id
    state.userInfo.userName = data.userName
    state.userInfo.email = data.email
    state.userInfo.idDadmin = data.dadmin
    state.userInfo.hasLoadedOnce = true
  },
  [AUTH_ERROR]: (state) => {
    state.userInfo = {}
    state.accessToken = ''
    state.accessTokenExpiry = ''
    state.status = 'error'
    state.hasLoadedOnce = true
  },
  [AUTH_LOGOUT]: (state) => {
    const apiServerHost = localStorage.getItem('app-api-server-url')
    state.token = ''
    state.userInfo = {}
    state.tokenExpiry = ''
    state.userAccount = {}

    localStorage.clear()

    localStorage.setItem('app-api-server-url', apiServerHost)
  },
  [USER_ACCOUNT]: (state, accountId) => {
    state.userAccount.accountId = accountId
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
