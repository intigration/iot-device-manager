<template>
  <div>
    <el-form :model="form" :rules="rules" ref="form">
      <el-row :gutter="20">
        <!-- <el-col :span="12" class="mb-6">
        <el-form-item prop="interface_ip">
          <el-input placeholder="Interface IP" v-model="form.interface_ip"></el-input>
        </el-form-item>
        </el-col>-->
        <el-col :span="12" class="mb-6">
          <el-form-item prop="ip_address">
            <el-input placeholder="Static IP" v-model="form.ip_address"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="mb-6">
          <el-form-item prop="netmask">
            <el-input placeholder="Net Mask" v-model="form.netmask"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="mb-3">
          <el-form-item prop="gateway">
            <el-input placeholder="Gateway IP" v-model="form.gateway"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <span class="text-gray-600 text-sm">Optional</span>
        </el-col>
        <el-col :span="12" class>
          <el-form-item prop="nameserver1">
            <el-input placeholder="Nameserver 1" v-model="form.nameserver1"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="mb-6">
          <el-form-item prop="nameserver2">
            <el-input placeholder="Nameserver 2" v-model="form.nameserver2"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24" class="mt-2">
          <div class="flex flex-row-reverse">
            <el-button type="primary" @click="showConfirmationBeforeIfTcp">Apply Static Configurations</el-button>
          </div>
        </el-col>
      </el-row>
    </el-form>

    <el-dialog title="Warning" :visible.sync="confirmationDialog">
      <div
        class="leading-normal break-words"
      >DSA is connected to the EdgeCore over HTTP. Changing network settings may cause a break in DSA connection; manual reconnection may be required afterwards for proper functioning of DSA.</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="confirmationDialog = false">Cancel</el-button>
        <el-button type="primary" @click="onConfirm">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { applyNetworkStatic } from '../../services/gateway-configurations.service'

export default {
  computed: mapGetters(['deviceConnectionProtocol']),
  data: () => ({
    confirmationDialog: false,
    form: {
      interface_ip: '',
      ip_address: '',
      netmask: '',
      gateway: '',
      nameserver1: '',
      nameserver2: ''
    },
    rules: {
      ip_address: [
        { required: true, message: 'Static IP required', trigger: 'change' }
      ],
      netmask: [
        { required: true, message: 'Netmask is required', trigger: 'change' }
      ],
      gateway: [
        { required: true, message: 'Gateway IP required', trigger: 'change' }
      ]
    }
  }),
  methods: {
    showConfirmationBeforeIfTcp () {
      if (this.deviceConnectionProtocol === 'TCP' || this.deviceConnectionProtocol === 'HTTP') {
        this.confirmationDialog = true
      } else {
        this.applyStaticConfig()
      }
    },

    async onConfirm () {
      this.confirmationDialog = false
      await this.applyStaticConfig()
    },

    applyStaticConfig () {
      this.$refs['form'].validate(valid => {
        if (valid) {
          const nameserver = [this.form.nameserver1, this.form.nameserver2]
          const propsToSubmit = Object.assign({}, this.form, { nameserver })
          const isTcp = this.deviceConnectionProtocol === 'TCP'

          applyNetworkStatic(propsToSubmit, this.$notify, isTcp)

          this.$message({
            type: 'warning',
            message: 'You will be redirected to Connection Page'
          })

          setTimeout(() => this.$router.push('/'), 1000)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
