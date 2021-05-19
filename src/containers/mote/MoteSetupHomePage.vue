<template>
  <el-container id="mhsp" direction="vertical">

    <el-main id="mhsp-info">
      <el-tabs v-model="activeName">
        <el-tab-pane label="Info" name="info">
          <el-card shadow="never" class="mhp-box-card">
            <el-row class="mb-40">
              <el-col :span="12">
                <h3>
                  <font-awesome-icon icon="info-circle"></font-awesome-icon>
                  Basic Information
                </h3>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="12">
                <div class="info__label">serial</div>
                <div class="info__value">{{deviceSerialNumber}}</div>
              </el-col>

              <el-col :span="8">
                <div class="info__label">Connection Type</div>
                <div class="info__value">{{moteNetworkConfig.interface === 'eth0' ? 'Ethernet' : 'WiFi'}}</div>
              </el-col>

              <el-col :span="4">
                <div class="info__label">Type</div>
                <div class="info__value">MQTT</div>
              </el-col>

              <el-col :span="8">
                <div class="info__label">Allowed Configurations</div>
                <div class="info__value">{{moteNetworkConfig.fw_type}} only</div>
              </el-col>
            </el-row>
          </el-card>
        </el-tab-pane>

        <el-tab-pane label="Network Config" name="second">
          <el-card shadow="never" class="mhp-box-card">
              <el-row class="mb-40">
                <el-col :span="8">
                  <h3>
                    <font-awesome-icon icon="sitemap"></font-awesome-icon>
                    Network Information
                  </h3>
                </el-col>
                <el-col :span="16" class="action_alignment">
                  <el-button type="primary" icon="el-icon-refresh" @click="refreshNetworkConfig" circle :loading="configInProgress"></el-button>
                  <el-button round @click="dialogVisible = true">Update Config</el-button>
                  <el-button round @click="brokerUpdateModal = true">Update Gateway IP</el-button>
                </el-col>
              </el-row>

              <el-row v-loading="loadingNetworkInfo">
                <el-col :span="8">
                  <div class="info__label">IP Address</div>
                  <div class="info__value">{{moteNetworkConfig.ip_address}}</div>
                </el-col>

                <el-col :span="8">
                  <div class="info__label">Net Mask</div>
                  <div class="info__value">{{moteNetworkConfig.netmask}}</div>
                </el-col>

                <el-col :span="8">
                  <div class="info__label">Gateway</div>
                  <div class="info__value">{{moteNetworkConfig.gateway}}</div>
                </el-col>

                <el-col :span="8">
                  <div class="info__label">MAC</div>
                  <div class="info__value">{{moteNetworkConfig.mac_address}}</div>
                </el-col>
              </el-row>

          </el-card>
        </el-tab-pane>

      </el-tabs>
    </el-main>

    <el-footer></el-footer>

    <!-- Dialog for broker ip address update -->
    <el-dialog
      title="Update EdgeCore IP Address"
      :visible.sync="brokerUpdateModal"
      width="40%"
      :before-close="handleClose">

      <div>
        <el-row id="network-config-form" v-loading="applyingConfig">
          <el-col :span="24">
            <el-input
              :placeholder="moteHostGatewayIp"
              v-model="form.broker.ip_address">
            </el-input>
            <div v-if="moteHostGatewayIp" style="font-size: 12px; margin-top: 8px; color: #919191;">
              Host EdgeCore IP : <strong style="color: black">{{moteHostGatewayIp}}</strong>
            </div>
          </el-col>
        </el-row>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="brokerUpdateModal = false">Close</el-button>
        <el-button type="primary" @click="applyBrokerConfig" :loading="configInProgress">Confirm</el-button>
      </span>
    </el-dialog>

    <!-- Dialog for network configurations update -->
    <el-dialog
      title="Setup Network Configuration"
      :visible.sync="dialogVisible"
      width="60%"
      :before-close="handleClose">
      <div>
        <el-row id="network-config-form" v-loading="applyingConfig">
          <!-- wifi configurations input fields -->

          <div v-if="moteNetworkConfig.fw_type === 'wifi'">
            <el-col :span="24">
              <strong>WiFi Information</strong> <small>(only WPA, WPA2 supported)</small>
            </el-col>
            <el-col :span="11" style="margin-right: 8px">
              <el-input
                placeholder="SSID"
                v-model="form.wifi.ssid">
              </el-input>
            </el-col>
            <el-col :span="12" class="align-right" style="padding-left: 8px">
              <el-input
                placeholder="Passphrase"
                :type="passwordFieldState"
                v-model="form.wifi.password">

                <el-button slot="append" @click="togglePasswordField()">
                  <font-awesome-icon v-if="passwordFieldState === 'password'" icon="eye"></font-awesome-icon>
                  <font-awesome-icon v-if="passwordFieldState !== 'password'" icon="eye-slash"></font-awesome-icon>
                </el-button>
              </el-input>
            </el-col>
          </div>

          <!-- network configurations input fields -->

          <div v-if="moteNetworkConfig.fw_type === 'ethernet'">
            <el-col :span="12">
              Configuration Type
            </el-col>
            <el-col :span="12" class="align-right">
              <el-switch
                style="display: block"
                v-model="networkOptEthDhcp"
                active-color="#13ce66"
                inactive-color="#409EFF"
                active-text="DHCP"
                inactive-text="Static">
              </el-switch>
            </el-col>
          </div>

          <div v-if="moteNetworkConfig.fw_type === 'ethernet' && !networkOptEthDhcp">
            <el-col :span="24">
              <strong>Static Information</strong>
            </el-col>
            <el-col :span="11" style="margin-right: 8px">
              <el-input
                placeholder="Static IP"
                v-model="form.eth_static.ip_address">
              </el-input>
            </el-col>
            <el-col :span="12" class="align-right" style="padding-left: 8px">
              <el-input
                placeholder="Net Mask"
                v-model="form.eth_static.netmask">
              </el-input>
            </el-col>
            <el-col :span="11" style="margin-right: 8px">
              <el-input
                placeholder="Gateway IP"
                v-model="form.eth_static.gateway">
              </el-input>
            </el-col>
            <el-col :span="12" class="align-right" style="padding-left: 8px">
              <el-input
                placeholder="DNS 0"
                v-model="form.eth_static.dns_0">
              </el-input>
            </el-col>
            <el-col :span="11" style="margin-right: 8px">
              <el-input
                placeholder="DNS 1"
                v-model="form.eth_static.dns_1">
              </el-input>
            </el-col>
            <el-col :span="12" class="align-right" style="padding-left: 8px">
              <el-input
                placeholder="DNS 2"
                v-model="form.eth_static.dns_2">
              </el-input>
            </el-col>
          </div>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">Close</el-button>
        <el-button type="primary" @click="applyConfig(moteNetworkConfig.fw_type)" :loading="configInProgress">Confirm</el-button>
      </span>
    </el-dialog>

    <!-- Error alert dialog -->
    <el-dialog
      title="Error"
      :visible.sync="errorAlertDialog">

      <span>{{errorDialogMessage}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="default" @click="closeDialog">Retry</el-button>
      </span>

      <div id="developer-message" v-if="developerErrorMessage.length">
        <el-collapse>
          <el-collapse-item title="Detail Error Information" name="1">
            <code>{{developerErrorMessage}}</code>
          </el-collapse-item>
        </el-collapse>
      </div>
    </el-dialog>

  </el-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { MOTE_NETWORK_CONFIG } from '@/store/actions/mote'
import { mixinProtocol } from '../../utils/communication/protocol'
import {
  ethernetDhcpCommand,
  ethernetWifiCommand,
  ethernetStaticCommand,
  getNetworkConfigCommand,
  brokerAddressUpdateCommand
} from '@/utils/commands/mote-command'
import { encrypt, decrypt } from '@/services/AoimAuthService'
import VueOnline from '@/utils/is-online'

export default {
  computed: mapGetters([
    'deviceSerialNumber',
    'deviceComPortName',
    'deviceConnectionProtocol',
    'moteNetworkConfig',
    'moteHostGatewayIp'
  ]),
  created () {
    this.form.broker.ip_address = this.moteHostGatewayIp || ''
  },
  data: () => ({
    errorAlertDialog: false,
    errorDialogMessage: '',
    developerErrorMessage: '',
    passwordFieldState: 'password',
    activeName: 'info',
    dialogVisible: false,
    brokerUpdateModal: false,
    loadingNetworkInfo: false,
    networkOptEthDhcp: true,
    applyingConfig: false,
    configInProgress: false,
    form: {
      wifi: {
        ssid: '',
        password: ''
      },
      eth_static: {
        ip_address: '',
        netmask: '',
        gateway: '',
        dns_0: '',
        dns_1: '',
        dns_2: ''
      },
      broker: {
        ip_address: ''
      }
    }
  }),

  methods: {
    closeDialog () {
      this.errorAlertDialog = false
      this.developerErrorMessage = ''
    },

    togglePasswordField () {
      if (this.passwordFieldState === 'password') {
        this.passwordFieldState = 'text'
      } else {
        this.passwordFieldState = 'password'
      }
    },

    handleClose (done) {
      this.$confirm('Are you sure to close this dialog?')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },

    startLoading () {
      this.loadingNetworkInfo = true
      setTimeout(() => (this.loadingNetworkInfo = false), 4000)
    },

    comPortConnectionErrorHandling (data) {
      this.errorDialogMessage = data.err.message || 'Failed to open port connection'
      this.errorAlertDialog = true
    },

    async applyBrokerConfig () {
      if (!VueOnline.isOnline) {
        this.applyingConfig = false
        this.configInProgress = false
        return
      }

      if (this.form.broker.ip_address.length === 0) {
        return
      }

      try {
        this.applyingConfig = true
        this.configInProgress = true

        const cmd = await encrypt(
          this.deviceSerialNumber,
          JSON.stringify(brokerAddressUpdateCommand(this.form.broker.ip_address)))

        this.sendCommand(cmd.data.data, false) // 20 seconds because ALI said & I created not to reload
      } catch ({ response }) {
        this.applyingConfig = false
        this.configInProgress = false
        // alert(JSON.stringify(e), 'xhr: error updateBrokerConfig')

        this.errorAlertDialog = true
        this.errorDialogMessage = response.data.FailureDescription || 'Error occured'
        this.developerErrorMessage = JSON.stringify(response.data)
      }
    },

    async applyConfig (firmwareType) {
      try {
        if (!VueOnline.isOnline) {
          this.applyingConfig = false
          this.configInProgress = false
          return
        }

        if (this.configInProgress) {
          this.showMessage('old config in process, please wait until it complete', 'warning')
          return
        }

        this.applyingConfig = true
        this.configInProgress = true

        if (firmwareType === 'ethernet' && this.networkOptEthDhcp) {
          const cmd = await encrypt(
            this.deviceSerialNumber,
            JSON.stringify(ethernetDhcpCommand())
          )

          this.sendCommand(cmd.data.data)
          return
        }

        if (firmwareType === 'ethernet' && !this.networkOptEthDhcp) {
          const cmd = await encrypt(
            this.deviceSerialNumber,
            JSON.stringify(ethernetStaticCommand(this.form.eth_static))
          )

          this.sendCommand(cmd.data.data)
          return
        }

        if (firmwareType === 'wifi') {
          const cmd = await encrypt(
            this.deviceSerialNumber,
            JSON.stringify(ethernetWifiCommand(this.form.wifi))
          )
          this.sendCommand(cmd.data.data)
        }
      } catch ({ response }) {
        this.applyingConfig = false
        this.configInProgress = false
        // alert(JSON.stringify(e), 'xhr: error applyConfig')

        this.errorAlertDialog = true
        this.errorDialogMessage = response.data.FailureDescription || 'Error occured'
        this.developerErrorMessage = JSON.stringify(response.data)
      }
    },

    async refreshNetworkConfig () {
      try {
        if (!VueOnline.isOnline) {
          this.applyingConfig = false
          this.configInProgress = false
          return
        }

        if (this.configInProgress) {
          this.showMessage('old config in process, please wait until it complete', 'warning')
          return
        }

        this.loadingNetworkInfo = true
        this.configInProgress = true

        const cmd = await encrypt(
          this.deviceSerialNumber,
          JSON.stringify(getNetworkConfigCommand())
        )

        mixinProtocol(this.deviceConnectionProtocol).writeToMote(cmd.data.data, this.deviceComPortName, async data => {
          if (typeof data === 'object' && data.hasOwnProperty('error')) {
            this.comPortConnectionErrorHandling(data)
            return
          }

          const resp = await decrypt(this.deviceSerialNumber, data)
          const { Parameters } = JSON.parse(resp.data.data)
          this.$store.dispatch(MOTE_NETWORK_CONFIG, Parameters)
          this.loadingNetworkInfo = false
          this.configInProgress = false
        })
      } catch ({ response }) {
        // alert(JSON.stringify(e), 'xhr: error refreshNetworkConfig')
        this.errorAlertDialog = true
        this.errorDialogMessage = response.data.FailureDescription || 'Error occured'
        this.developerErrorMessage = JSON.stringify(response.data)
      }
    },

    async sendCommand (cmd, refreshNetworkConfig = true) {
      try {
        mixinProtocol(this.deviceConnectionProtocol).writeToMote(cmd, this.deviceComPortName, async data => {
          if (typeof data === 'object' && data.hasOwnProperty('error')) {
            this.comPortConnectionErrorHandling(data)
            return
          }

          const resp = await decrypt(this.deviceSerialNumber, data)
          const { Parameters } = JSON.parse(resp.data.data)
          this.$notify({
            title: 'Network Configurations',
            message: Parameters.Reason
          })
          this.disableAllLoaders()

          if (refreshNetworkConfig) {
            setTimeout(() => this.refreshNetworkConfig(), 800)
          }
        })
      } catch ({ response }) {
        this.disableAllLoaders()
        // alert(JSON.stringify(e) + ' ' + cmd, 'xhr: error refreshNetworkConfig')
        this.errorAlertDialog = true
        this.errorDialogMessage = response.data.FailureDescription || 'Error occured'
        this.developerErrorMessage = JSON.stringify(response.data)
      }
    },

    showMessage (message, type) {
      this.$message({ message, type })
    },

    disableAllLoaders () {
      this.applyingConfig = false
      this.dialogVisible = false
      this.brokerUpdateModal = false
      this.configInProgress = false
    }
  }
}
</script>

<style>
#mhsp .el-main {
  padding: 0 0 30px 0 !important;
}
.el-tabs__nav-scroll {
  padding: 0 120px !important;
}
#mhsp-info .mhp-box-card {
  margin: 0 auto;
}
#mhsp-info .el-card {
  border: 0 !important;
  margin: 0 120px;
}
#mhsp-info .el-card__body {
  padding: 20px 0 !important;
}
#mhsp-info .info__label {
  color: gray;
  text-transform: uppercase;
  font-size: small;
  padding-bottom: 8px;
}
#mhsp-info .info__value {
  font-size: 20px;
  padding-bottom: 30px;
}
#mhsp-info .mb-40 {
  margin-bottom: 40px;
}
#mhsp-info .action_alignment {
  padding-top: 10px !important;
  text-align: right;
}

#mhsp .el-dialog__footer {
  background: #efefef !important;
  border-top: 1px solid #ccc !important;
  padding: 10px !important;
}

#mhsp .el-dialog__body {
  padding: 30px !important;
}

.align-right {
  text-align: right;
}

#network-config-form .el-col {
  padding-bottom: 20px;
}
#developer-message {
  border: 1px solid #b8b8b8;
  margin-top: 20px;
  padding: 5px 5px;
}
</style>
