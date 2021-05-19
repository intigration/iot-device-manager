import Vue from 'vue'

/**
 * !NOTE: Following code is not working well in ubuntu
 */

const main = new Vue({
  data: () => {
    return {
      isOnline: true
    }
  },
  methods: {
    updateStatus: () => {
      if (typeof window.navigator.onLine === 'undefined') {
        // If the browser doesn't support connection status reports
        // assume that we are online because most apps' only react
        // when they now that the connection has been interrupted
        main.isOnline = true
      } else {
        main.isOnline = window.navigator.onLine
      }
    }
  }
})

// Initial setup
main.updateStatus()

// Setup the listeners when state change
window.addEventListener('online', main.updateStatus)
window.addEventListener('offline', main.updateStatus)

export default main
