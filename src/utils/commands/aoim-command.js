/* eslint-disable */

const isRequired = parameter => {
  throw new Error(`Missing parameter: ${parameter}`)
}

export const deviceAuthCommand = randomChallenge => {
  return { Command: 0, Parameters: { rand_num_1: randomChallenge } }
}

export const hostAuthCommand = (
  c2 = isRequired('c2'),
  nk = isRequired('nk')
) => {
  return { Command: 1, Parameters: { c2, nk } }
}

export default {
  deviceAuthentication: deviceAuthCommand,
  hostAuthentication: hostAuthCommand
}