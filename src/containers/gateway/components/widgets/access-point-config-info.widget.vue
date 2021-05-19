<template>
  <el-card class="mb-6 hover:bg-white"
      v-loading="deviceSerialCommunicationLock"
      v-if="typeof gatewayAccessPointConfig === 'object' && Object.keys(gatewayAccessPointConfig).length > 0" shadow="hover">
    <div class="flex justify-between">
      <div class="text-gray-600 font-medium">Access Point Configurations</div>
      <div v-if="gatewayAccessPointModeInfo.Mode === 'Master'">
        <el-button size="mini" type="primary" @click="turnOff">Turn Off</el-button>
      </div>
    </div>
    <div class="mt-3">
      <div class="flex justify-between hover:bg-yellow-200">
        <span class="font-bold text-sm text-gray-800">SSID: </span>
        <span class="font-mono">{{gatewayAccessPointConfig.SSID || '-'}}</span>
      </div>
      <div class="flex justify-between hover:bg-yellow-200">
        <span class="font-bold text-sm text-gray-800">Passcode: </span>
        <span class="font-mono">{{gatewayAccessPointConfig.Security.Object.passphrase || '-'}}</span>
      </div>
      <div class="flex justify-between hover:bg-yellow-200">
        <span class="font-bold text-sm text-gray-800">Channel: </span>
        <span class="font-mono">{{gatewayAccessPointConfig.Channel || '-'}}</span>
      </div>
      <div class="flex justify-between hover:bg-yellow-200">
        <span class="font-bold text-sm text-gray-800">Security: </span>
        <span class="font-mono">{{gatewayAccessPointConfig.Security.Type || '-'}} ({{ gatewayAccessPointConfig.Security.Object['WPA-TYPE'] || '-'}})</span>
      </div>
      <div class="flex justify-between hover:bg-yellow-200">
        <span class="font-bold text-sm text-gray-800">Gateway: </span>
        <span class="font-mono">{{gatewayAccessPointConfig.DNS.gateway || '-'}}</span>
      </div>
      <div class="flex justify-between hover:bg-yellow-200">
        <span class="font-bold text-sm text-gray-800">IP Range: </span>
        <span class="font-mono">{{gatewayAccessPointConfig.DNS.ip_range[0] || '-'}} - {{gatewayAccessPointConfig.DNS.ip_range[1] || '-'}}</span>
      </div>
    </div>
  </el-card>
</template>

<script>
import { mapGetters } from 'vuex'
import { turnOffAccessPoint } from '../../services/gateway-configurations.service'

export default {
  computed: mapGetters([
    'gatewayAccessPointConfig',
    'deviceSerialCommunicationLock',
    'gatewayAccessPointModeInfo'
  ]),

  methods: {
    turnOff () {
      turnOffAccessPoint(this.$notify)
    }
  }
}
</script>
