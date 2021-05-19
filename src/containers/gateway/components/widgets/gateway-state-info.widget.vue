<template>
  <el-card class="mb-6 bg-gray-100 hover:bg-white" shadow="hover" v-loading="deviceSerialCommunicationLock">
    <div class="flex justify-between items-center">
      <div class="text-gray-600 font-medium">Information</div>
      <el-button size="mini" plain type="primary" @click="reloadAllConfig()">Refresh</el-button>
    </div>
    <div class="mt-2 flex justify-between">
      <div>
        <div>
          <span class="font-bold text-sm text-gray-800">Serial Number: </span>
          <span class="font-mono pl-1">{{gatewayBackendRetrievedInfo['serial']}} </span>
        </div>
        <div>
          <span class="font-bold text-sm text-gray-800">Firmware: </span>
          <span class="font-mono pl-1">{{gatewayBackendRetrievedInfo.firmwareVersion}} </span>
        </div>
        <div>
          <span class="font-bold text-sm text-gray-800">Type: </span>
          <span class="font-mono pl-1">{{gatewayBackendRetrievedInfo.firmwareType}} </span>
        </div>
      </div>
      <div>
        <div title="EdgeCore network connectivity, it is different from its backend connectivity">
          <span class="font-bold text-sm text-gray-800">Internet: </span>
          <span v-if="gatewayDeviceState" class="font-mono pl-1">{{connectivityState[gatewayDeviceState.Connection_status]}}</span>
        </div>
        <div>
          <span class="font-bold text-sm text-gray-800">Connection Type: </span>
          <span  v-if="gatewayDeviceState" class="font-mono pl-1">{{gatewayDeviceState.Connection}}</span>
        </div>
        <div>
          <span class="font-bold text-sm text-gray-800">Signaling Proxy: </span>
          <span  v-if="gatewayDeviceState" class="font-mono pl-1">{{gatewaySigProxyInfo['ENABLE_SIG_PROXY'] === "1" ? 'Enabled' : 'Disabled'}}</span>
        </div>
      </div>
      <div>
        <div>
          <span class="font-bold text-sm text-gray-800">Access Point: </span>
          <span v-if="gatewayAccessPointModeInfo" class="font-mono pl-1">{{gatewayAccessPointModeInfo.Mode || '-'}}</span>
        </div>
        <div>
          <span class="font-bold text-sm text-gray-800">Commissioning State: </span>
          <span class="font-mono pl-1">{{commissioningState[gatewayAuthState.state]}}</span>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script>
import { mapGetters } from 'vuex'
import { fetchAllGatewayConfigs } from '../../services/gateway-configurations.service'

export default {
  computed: mapGetters([
    'gatewayDeviceState',
    'gatewayAuthState',
    'gatewayBackendRetrievedInfo',
    'gatewayAccessPointModeInfo',
    'deviceSerialCommunicationLock',
    'gatewaySigProxyInfo'
  ]),
  data: () => ({
    connectivityState: {
      1: 'Connected',
      0: 'Disconnected'
    },
    commissioningState: {
      1: 'BLANK',
      2: 'MANUFACTURED',
      3: 'READY',
      4: 'OPERATIONAL'
    }
  }),

  methods: {
    reloadAllConfig () {
      fetchAllGatewayConfigs()
    }
  }
}
</script>

