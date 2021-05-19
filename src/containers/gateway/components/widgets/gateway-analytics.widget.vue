<template>
  <el-row :gutter="20" style="margin-top: 10px; margin-bottom: 10px;">
    <el-col :span="5">
      <text-widget label="Cloud Connectivity" icon="el-icon-cloudy" unit="" :value="gwBeConnectivity" />
    </el-col>

    <el-col :span="6">
      <text-widget label="Network (Download | Upload)" icon="el-icon-sort" unit="kbps" :value="gwNetworkInOut" />
    </el-col>

    <el-col :span="5">
      <text-widget label="CPU & Memory" icon="el-icon-cpu" unit="%" :value="gwCpuMemory" />
    </el-col>

    <el-col :span="4">
      <text-widget label="Disk" unit="%" icon="el-icon-c-scale-to-original" :value="gwSystemDisk" />
    </el-col>

    <el-col :span="4">
      <text-widget label="System Load" icon="el-icon-monitor" unit="%" :value="gwSystemLoad" />
    </el-col>
  </el-row>
</template>

<script>
import { mapGetters } from 'vuex'
import TextWidget from '../analytics/text-chart.widget'

export default {
  components: {
    TextWidget
  },

  computed: mapGetters([
    'gwBeConnectivity',
    'gwCpuMemory',
    'gwSystemDisk',
    'gwContainerDisk',
    'gwNetworkInOut',
    'gwSystemLoad'
  ])
}
</script>

<style scoped>

</style>