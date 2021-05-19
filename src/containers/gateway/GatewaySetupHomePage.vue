<template>
  <el-container id="mhsp" direction="vertical">
    <el-main id="mhsp-gateway-info">
      <!-- mhsp-info  -->
      <el-tabs v-model="activeName">
        <el-tab-pane label="Dashboard" name="tab-info">
          <info-component></info-component>
        </el-tab-pane>
        <el-tab-pane label="" name="tab-monitoring">
          <span slot="label">
            <i class="text-gray-700 el-icon-pie-chart"></i>
            Monitoring
            <!-- <span class="bg-orange-500 text-white rounded-lg py-1 px-2 text-xs font-normal tracking-wider">new</span> -->
          </span>
          <gateway-monitoring-tab></gateway-monitoring-tab>
        </el-tab-pane>
        <el-tab-pane label="Network Settings" name="tab-network">
          <network-component></network-component>
        </el-tab-pane>
        <el-tab-pane label="Signaling Proxy" name="tab-signaling-proxy">
          <signaling-proxy-component></signaling-proxy-component>
        </el-tab-pane>
        <el-tab-pane label="Access Point" name="tab-access-point" disabled>
          <access-point-component></access-point-component>
        </el-tab-pane>
        <el-tab-pane label="Thread Settings" name="tab-thread" disabled>
          <thread-component></thread-component>
        </el-tab-pane>
      </el-tabs>
    </el-main>
  </el-container>
</template>

<script>
import InfoComponent from './components/tab-components/gateway-info.tab'
import NetworkComponent from './components/tab-components/gateway-network.tab'
import AccessPointComponent from './components/tab-components/gateway-accesspoint.tab'
import SignalingProxyComponent from './components/tab-components/gateway-signaling-proxy.tab'
import ThreadComponent from './components/tab-components/gateway-thread.tab'
import GatewayMonitoringTab from './components/tab-components/gateway-monitoring.tab'

export default {
  components: {
    InfoComponent, NetworkComponent, AccessPointComponent, SignalingProxyComponent, ThreadComponent, GatewayMonitoringTab
  },
  data: () => ({
    activeName: 'tab-info'
  })
}
</script>

<style>
#mhsp-gateway-info {
}
.el-tabs__nav-wrap {
  background: #FFFFFF !important;
}
/* .el-tabs__nav-wrap::after {
  background: none !important;
} */
</style>

