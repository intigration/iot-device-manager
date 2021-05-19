<template>
  <div style="margin: 0 120px;" class="pt-6">
    <el-row :gutter="20">
      <el-col :span="12">
        <network-config-info-widget class="bg-gray-100"></network-config-info-widget>
      </el-col>
      <el-col :span="12">
        <div class="text-gray-600 font-medium">Setup Configurations</div>
        <el-form v-loading="deviceSerialCommunicationLock">
          <el-form-item>
            <div>Network Interface</div>

            <el-radio-group v-model="configurationType" class="radio-group-inline-block">
              <el-radio label="ethernet" border>Ethernet</el-radio>
              <!-- <el-radio label="wifi" border :disabled="gatewayAccessPointModeInfo.Mode === 'Master'">WiFi</el-radio> -->
              <el-radio label="wifi" border :disabled="true">WiFi</el-radio>
              <el-alert class="mt-2" v-if="gatewayAccessPointModeInfo.Mode === 'Master'"
                :closable="false"
                type="warning"
                description="Access Point need to be turn off to configure edge-core network to Wireless">
              </el-alert>
            </el-radio-group>
          </el-form-item>

          <el-form-item v-if="configurationType === 'ethernet'">
            <div class="flex justify-between items-center">
              <div>
                Configuration Type
              </div>
              <el-switch
                style="display: block"
                v-model="networkOptEthDhcp"
                active-color="#13ce66"
                inactive-color="#409EFF"
                active-text="DHCP"
                inactive-text="Static">
              </el-switch>
            </div>
          </el-form-item>

          <el-form-item v-if="configurationType === 'ethernet'">
            <div v-if="networkOptEthDhcp">
              <network-dhcp-form></network-dhcp-form>
            </div>

            <div v-if="!networkOptEthDhcp">
              <network-static-form />
            </div>
          </el-form-item>

          <el-form-item v-if="configurationType !== 'ethernet'">
            <div>
              <network-wi-fi-form></network-wi-fi-form>
            </div>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import NetworkConfigInfoWidget from '../widgets/network-config-info.widget'
import NetworkDhcpForm from '../forms-components/network-dhcp.vue'
import NetworkStaticForm from '../forms-components/network-static.vue'
import NetworkWiFiForm from '../forms-components/network-wifi.vue'

export default {
  components: {
    NetworkConfigInfoWidget,
    NetworkDhcpForm,
    NetworkStaticForm,
    NetworkWiFiForm
  },

  computed: mapGetters([
    'deviceSerialCommunicationLock',
    'gatewayAccessPointModeInfo'
  ]),

  data: () => ({
    configurationType: 'ethernet',
    networkOptEthDhcp: true
  })
}
</script>

<style>
.radio-group-inline-block {
  display: inline-block !important;
}
</style>

