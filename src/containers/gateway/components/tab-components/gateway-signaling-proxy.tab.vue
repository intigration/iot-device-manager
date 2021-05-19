<template>
  <div style="margin: 0 120px;" class="pt-6">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card class="mb-6 bg-gray-100 hover:bg-white" shadow="hover" v-loading="deviceSerialCommunicationLock">
          <div class="text-gray-600 font-medium">Information</div>
          <div class="mt-2 flex justify-between">
            <div>
              <div>
                <span class="font-bold text-sm text-gray-800">Signaling Proxy State: </span>
                <span class="font-mono pl-1">{{gatewaySigProxyInfo['ENABLE_SIG_PROXY'] === "1" ? 'Enabled' : 'Disabled'}}</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="12">
        <div class="text-gray-600 font-medium">Setup Proxy</div>
        <el-form v-loading="deviceSerialCommunicationLock">
          <el-form-item>
            <div>
              <el-switch v-model="isEnabled" @change="toggleSignalingProxy"></el-switch>
            </div>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { turnOnSignalingProxy, turnOffSignalingProxy } from '../../services/gateway-configurations.service'

export default {
  computed: mapGetters([
    'deviceSerialCommunicationLock',
    'gatewaySigProxyInfo'
  ]),
  data: () => ({
    isEnabled: false
  }),
  created () {
    this.updateIsEnabledSwitchState()
  },
  methods: {
    async toggleSignalingProxy () {
      this.updateIsEnabledSwitchState()
      if (this.isEnabled) {
        await turnOffSignalingProxy(this.$notify)
        this.updateIsEnabledSwitchState()
      } else {
        await turnOnSignalingProxy(this.$notify)
        this.updateIsEnabledSwitchState()
      }
    },

    updateIsEnabledSwitchState () {
      this.isEnabled = this.gatewaySigProxyInfo['ENABLE_SIG_PROXY'] === '1'
    }
  },
  watch: {
    gatewaySigProxyInfo () {
      this.updateIsEnabledSwitchState()
    }
  }
}
</script>