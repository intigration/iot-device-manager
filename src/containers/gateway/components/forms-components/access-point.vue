<template>
  <el-form 
    :model="form" 
    :rules="rules" 
    ref="form" 
    :disabled="gatewayDeviceState.Connection !== 'Wired'"
    v-loading="deviceSerialCommunicationLock">
    
    <el-row :gutter="20">
      <el-col :span="24" class="mb-4" v-if="gatewayDeviceState.Connection !== 'Wired'">
        <el-alert
          :closable="false"
          type="warning"
          description="Configure edge-core to Ethernet first to setup Access Point">
        </el-alert>
      </el-col>
      <el-col :span="12" class="mb-1">
        <el-form-item prop="ssid">
          <el-input placeholder="SSID" v-model="form.ssid"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12" class="mb-1">
        <el-form-item prop="password">
          <el-input placeholder="Passcode" v-model="form.password"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12" class="mb-1">
        <el-form-item prop="channel">
          <el-input placeholder="Channel" v-model="form.channel"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12" class="mb-1">
        <el-form-item prop="gatewayIp">
          <el-input placeholder="Gateway IP" v-model="form.gatewayIp" :value="1"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12" class="mb-1">
        <el-form-item prop="lowerIp">
          <el-input placeholder="Lower IP" v-model="form.lowerIp"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12" class="mb-1">
        <el-form-item prop="upperIp">
          <el-input placeholder="Upper IP" v-model="form.upperIp"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24" class="mt-2">
        <div class="flex flex-row-reverse">
          <el-button type="primary" @click="applyStaticConfig">Enable Access Point</el-button>
          <el-button type="" class="mr-4" @click="initAccessPointConfigForm">Copy Existing</el-button>
        </div>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import { applyAccessPointSettings } from '../../services/gateway-configurations.service'
import { mapGetters } from 'vuex'

export default {
  data: () => ({
    form: {
      ssid: '',
      channel: '',
      password: '',
      gatewayIp: '',
      lowerIp: '',
      upperIp: ''
    },
    rules: {
      ssid: [{ required: true, message: 'Required', trigger: 'change' }],
      channel: [{ required: true, message: 'Required', trigger: 'change' }],
      password: [{ required: true, message: 'Required', trigger: 'change' }],
      gatewayIp: [{ required: false, message: 'Required', trigger: 'change' }],
      lowerIp: [{ required: false, message: 'Required', trigger: 'change' }],
      upperIp: [{ required: false, message: 'Required', trigger: 'change' }]
    }
  }),
  computed: mapGetters([
    'gatewayAccessPointConfig',
    'gatewayDeviceState',
    'deviceSerialCommunicationLock'
  ]),
  created () {
    // this.initAccessPointConfigForm()
  },
  methods: {
    applyStaticConfig () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          const ipRange = [this.form.lowerIp, this.form.upperIp]
          const propsToSubmit = Object.assign({}, this.form, { ipRange })
          applyAccessPointSettings(propsToSubmit, this.$notify)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },

    initAccessPointConfigForm () {
      this.form.ssid = this.gatewayAccessPointConfig.SSID
      this.form.channel = this.gatewayAccessPointConfig.Channel
      this.form.password = this.gatewayAccessPointConfig.Security.Object.passphrase
      this.form.gatewayIp = this.gatewayAccessPointConfig.DNS.gateway
      this.form.lowerIp = this.gatewayAccessPointConfig.DNS.ip_range[0]
      this.form.upperIp = this.gatewayAccessPointConfig.DNS.ip_range[1]
    }
  }
}
</script>
