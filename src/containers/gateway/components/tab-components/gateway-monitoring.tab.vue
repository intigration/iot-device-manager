<template>
  <div style="margin: 0 120px;">
    <el-row :gutter="20">
      <el-col :span="24" class="mb-10">
        <gateway-analytics-bar />
      </el-col>

      <el-col :span="8">
        <connectivity-history />
      </el-col>

      <el-col :span="4">
        <disk-usage-chart />
      </el-col>

      <el-col :span="12">
        <cpu-usage-chart />
      </el-col>

      <el-col :span="12">
        <network-usage-chart />
      </el-col>

      <el-col :span="12">
        <system-load-chart />
      </el-col>

    </el-row>
  </div>
</template>

<script>
import GatewayAnalyticsBar from '../widgets/gateway-analytics.widget'
import ConnectivityHistory from '../analytics/connectivity.widget'
import CpuUsageChart from '../analytics/cpu.widget'
import DiskUsageChart from '../analytics/disk.widget'
import SystemLoadChart from '../analytics/system-load.widget'
import NetworkUsageChart from '../analytics/network.widget'

export default {
  components: {
    GatewayAnalyticsBar,
    ConnectivityHistory,
    CpuUsageChart,
    DiskUsageChart,
    SystemLoadChart,
    NetworkUsageChart
  }
}
</script>

<style scoped>

</style>
