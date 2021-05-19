/* eslint-disable */
import store from '@/store/index'

let port

export function portList () {
  // return serialport.list()
}


export function connect () {
  console.log('serial-connect')
}


export function disconnect () {
  console.log('disconnection request', port)

}



// TODO: fix this port undefined error
function isOpen() {
  // if (port !== undefined) {
  //   return true;
  // }
  return false
}
