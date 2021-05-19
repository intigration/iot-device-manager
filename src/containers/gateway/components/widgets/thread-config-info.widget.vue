<template>
  <el-card v-loading="deviceSerialCommunicationLock" v-if="typeof gatewayNetworkConfig === 'object' && Object.keys(gatewayNetworkConfig).length > 0" class="mb-6 hover:bg-white" shadow="hover">
    <div class="text-gray-600 font-medium">Thread Configurations</div>
    <div class="mt-3">
      <div class="flex justify-between hover:bg-yellow-200">
        <span class="font-bold text-sm text-gray-800">Connection Type: </span>
        <span class="font-mono">{{gatewayNetworkConfig.interface || '-'}}</span>
      </div>
      <div class="flex justify-between hover:bg-yellow-200">
        <span class="font-bold text-sm text-gray-800">IP Address: </span>
        <span class="font-mono">{{gatewayNetworkConfig.ip_address || '-'}}</span>
      </div>
      <div class="flex justify-between hover:bg-yellow-200">
        <span class="font-bold text-sm text-gray-800">Network Mask: </span>
        <span class="font-mono">{{gatewayNetworkConfig.netmask || '-'}}</span>
      </div>
      <div class="flex justify-between hover:bg-yellow-200">
        <span class="font-bold text-sm text-gray-800">Gateway Address: </span>
        <span class="font-mono">{{gatewayNetworkConfig.gateway || '-'}}</span>
      </div>
      <div class="flex justify-between hover:bg-yellow-200">
        <span class="font-bold text-sm text-gray-800">Eth0 MAC: </span>
        <span class="font-mono">{{gatewayNetworkConfig.Interfaces['ethernet0'] || '-'}}</span>
      </div>
      <div class="flex justify-between hover:bg-yellow-200">
        <span class="font-bold text-sm text-gray-800">Wlan0 MAC: </span>
        <span class="font-mono">{{gatewayNetworkConfig.Interfaces['wireless0'] || '-'}}</span>
      </div>
    </div>
  </el-card>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'thread-config-info-widget',
  computed: mapGetters([
    'gatewayNetworkConfig',
    'deviceSerialCommunicationLock'
  ])
}
</script>

<style>
.el-loading-spinner {
  display: flex;
  justify-content: center;
}
</style>

