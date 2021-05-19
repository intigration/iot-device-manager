import Layout from '@/layout'



const orionRouter = {
path: '/orion',
name: 'orion-home',
component: Layout,
redirect: '/orion/login',
children: [{
  path: 'login',
  component: require('@/views/orion/UserLoginPage').default,
//  beforeEnter: UnAuthenticated
},
{
  path: 'channels',
  name: 'channels',
  component: require('@/views/orion/DeviceListingPage').default,
  beforeEnter: Authenticated
},
{
  path: 'connection',
  name: 'device-connection-page',
  component: require('@/views/orion/DeviceConnectionPage').default,
//  beforeEnter: Authenticated
},
{
  path: 'nodes',
  name: 'nodes-home',
  component: require('@/views/orion/components/mote/MoteSetupHomePage').default,
//  beforeEnter: Authenticated
},
{
  path: 'gateway',
  name: 'gateway-setup-home-page',
  component: require('@/views/orion/components/gateway/GatewaySetupHomePage').default,
//   beforeEnter: Authenticated
},
{
  path: '*',
  redirect: '/orion/channels'
}
]}


export default orionRouter
