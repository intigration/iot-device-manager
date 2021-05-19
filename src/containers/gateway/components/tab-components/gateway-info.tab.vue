<template>
  <div style="margin: 0 120px;">
    <gateway-analytics />
    <el-row :gutter="20" style="margin-top: 30px">
      <el-col :span="24">
        <gateway-state-info-widget />
      </el-col>

      <el-col :span="12">
        <network-config-info-widget />
      </el-col>

      <el-col :span="12">
        <access-point-info-widget />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { fetchAllGatewayConfigs } from '../../services/gateway-configurations.service'
import GatewayStateInfoWidget from '../widgets/gateway-state-info.widget'
import NetworkConfigInfoWidget from '../widgets/network-config-info.widget'
import AccessPointInfoWidget from '../widgets/access-point-config-info.widget'
import GatewayAnalytics from '../widgets/gateway-analytics.widget'

export default {
  components: {
    GatewayStateInfoWidget,
    NetworkConfigInfoWidget,
    AccessPointInfoWidget,
    GatewayAnalytics
  },
  computed: mapGetters([
    'deviceComPortName'
  ]),
  data: () => ({}),
  created () {
    fetchAllGatewayConfigs()
  },
  methods: {

  }
}
</script>

<style>
</style>

