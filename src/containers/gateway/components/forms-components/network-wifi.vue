<template>
  <el-form :model="form" :rules="rules" ref="form" :disabled="gatewayAccessPointModeInfo.Mode === 'Master'">
    <el-row :gutter="20">
      <el-col :span="12" class="mb-6">
        <el-form-item prop="SSID">
          <el-input placeholder="SSID" v-model="form.SSID"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12" class="mb-6">
        <el-form-item prop="Password">
          <el-input placeholder="Password" v-model="form.Password"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24" class="mt-2">
        <div class="flex flex-row-reverse">
          <el-button type="primary" @click="applyWiFiConfig">Apply WiFi Configurations</el-button>
        </div>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import { mapGetters } from 'vuex'
import { applyNetworkWiFi } from '../../services/gateway-configurations.service'

export default {
  computed: mapGetters([
    'gatewayAccessPointModeInfo'
  ]),
  data: () => ({
    form: {
      SSID: '',
      Password: ''
    },
    rules: {
      SSID: [{ required: true, message: 'Required', trigger: 'change' }],
      Password: [{ required: true, message: 'Required', trigger: 'change' }]
    }
  }),
  methods: {
    applyWiFiConfig () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          const nameserver = [this.form.nameserver1, this.form.nameserver2]
          const propsToSubmit = Object.assign({}, this.form, { nameserver })
          applyNetworkWiFi(propsToSubmit, this.$notify)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
