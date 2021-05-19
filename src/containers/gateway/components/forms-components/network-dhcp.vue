<template>
  <div>
    <div class="flex flex-row-reverse">
      <el-button type="primary" @click="showConfirmationDialogIfTcp">Apply DHCP Configurations</el-button>
    </div>

    <el-dialog
      title="Warning"
      :visible.sync="confirmationDialog">
      <div class="leading-normal break-words">DSA is connected to the EdgeCore over HTTP. Changing network settings may cause a break in DSA connection; manual reconnection may be required afterwards for proper functioning of DSA.</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="confirmationDialog = false">Cancel</el-button>
        <el-button type="primary" @click="onConfirm">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { applyNetworkDhcp } from '../../services/gateway-configurations.service'

export default {
  data: () => ({
    confirmationDialog: false
  }),
  computed: mapGetters(['deviceConnectionProtocol']),
  methods: {
    showConfirmationDialogIfTcp () {
      if (this.deviceConnectionProtocol === 'TCP' || this.deviceConnectionProtocol === 'HTTP') {
        this.confirmationDialog = true
      } else {
        this.applyDhcpConfig()
      }
    },

    async onConfirm () {
      this.confirmationDialog = false
      await this.applyDhcpConfig()
      this.$message({
        type: 'warning',
        message: 'You will be redirected to Connection Page'
      })
      setTimeout(() => this.$router.push('/'), 800)
    },

    async applyDhcpConfig () {
      const isTcp = this.deviceConnectionProtocol === 'TCP'
      await applyNetworkDhcp(this.$notify, isTcp)
    }
  }
}
</script>

<style lang="css">
.el-dialog__body {
  word-break: unset;
}
</style>
