<template>
  <el-container id="mcp" :direction="'verticle'">
    <el-header style="padding: 16px;">
      <div style="font-weight: 500; color: #858e98;">
        Connecting ...
      </div>
      <h3 style="margin: 0px;">{{deviceSerialNumber}} &nbsp; <font-awesome-icon :icon="['fab', 'usb']"></font-awesome-icon>&nbsp; {{deviceComPortName}}</h3>
    </el-header>

    <el-main id="mcp-main">
      <el-card shadow="never" id="mcp-box-card">
        <font-awesome-icon :icon="['fas', 'spinner']" pulse></font-awesome-icon> Progress
        <el-progress :percentage="progressbarPercentage"></el-progress>
        <pre v-if="connectionProgress" class="connection-progress overflow-y-auto" v-html="connectionProgress"></pre>
        <el-button v-if="error" size="small" @click="goBack">back</el-button>
      </el-card>
    </el-main>

    <el-dialog
      title="Error"
      :visible.sync="errorAlertDialog">

      <span>{{errorDialogMessage}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="default" @click="goBack">Retry</el-button>
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
import { DEVICE_SERIAL_NUMBER, DEVICE_COM_PORT_NAME, DEVICE_IP_ADDRESS, DEVICE_CONNECTION_PROTOCOL } from '@/store/actions/device'
import { MOTE_HOST_GATEWAY_IP, MOTE_NETWORK_CONFIG } from '@/store/actions/mote'
import { mixinProtocol } from '../utils/communication/protocol'
import { deviceAuthCommand, hostAuthCommand } from '../utils/commands/aoim-command'
import { getNetworkConfigCommand } from '../utils/commands/mote-command'
import { authentication, gatewayCommissioningState } from '../utils/commands/gateway-command'
import {
  moteEncryptedCredentials,
  gatewayEncryptedCredentials,
  updateBackendOnMatInjectionSuccess,
  unlockGatewayOnBackend,
  gatewayCsr,
  gatewayDid
} from '../services/DeviceService'
import { encrypt, decrypt, authenticateDevice, authenticateHost } from '../services/AoimAuthService'
import VueOnline from '@/utils/is-online'

export default {
  asyncComputed: {},
  computed: mapGetters(['deviceSerialNumber', 'deviceType', 'deviceConnectionProtocol', 'deviceComPortName', 'deviceTcpConnectionIpAddress', 'aoimInitialRandomChallenge', 'gatewayBackendRetrievedInfo']),
  data: () => ({
    error: true,
    connectionProgress: '<strong style="color: #cc7832">Details</strong>',
    progressbarPercentage: 0,
    errorAlertDialog: false,
    errorDialogMessage: '',
    developerErrorMessage: ''
  }),
  methods: {

    goBack () {
      this.errorAlertDialog = false
      this.developerErrorMessage = ''
      mixinProtocol(this.deviceConnectionProtocol).disconnect()
      this.$store.dispatch(DEVICE_SERIAL_NUMBER, '')
      this.$store.dispatch(DEVICE_COM_PORT_NAME, '')
      this.$store.dispatch(MOTE_HOST_GATEWAY_IP, '')
      this.$store.dispatch(DEVICE_IP_ADDRESS, '')
      this.$store.dispatch(DEVICE_CONNECTION_PROTOCOL, '')
      this.$router.push('/')
    },

    comPortConnectionErrorHandling (data) {
      this.errorDialogMessage = data.err.message || 'Failed to open port connection'
      this.errorAlertDialog = true
    },

    async initDeviceHostMutualAuthentication () {
      const firstCommand = JSON.stringify(
        deviceAuthCommand(this.aoimInitialRandomChallenge)
      )

      this.connectionProgress += '<br>► Client authentication in progress'

      mixinProtocol(this.deviceConnectionProtocol).writeToMote(firstCommand, this.deviceComPortName, data => {
        console.count('FIRST COMMAND RESPONSE', data)
        if (typeof data === 'object' && data.hasOwnProperty('error')) {
          this.comPortConnectionErrorHandling(data)
          return
        }

        const resp = JSON.parse(data)
        const deviceAuthResponse = resp.Parameters

        if (resp.Response !== 0) {
          this.connectionProgress += '<br>✖ Device unable to execute command'
          this.connectionProgress += resp.Parameters['Reason'] ? '<br>✖ ' + resp.Parameters['Reason'] : ''
          this.error = true
          return
        }

        this.connectionProgress += '<br>✔ Authentication'
        this.progressbarPercentage += 10

        if (deviceAuthResponse) {
          this.helperMmK(
            deviceAuthResponse.c1,
            atob(deviceAuthResponse.rand_num_2)
          )
        }
      })
    },

    // Step 2 Validate c1, generate secret on random_num_2
    async helperMmK (c1, randNum2) {
      try {
        await authenticateDevice(this.deviceSerialNumber, this.aoimInitialRandomChallenge, c1)
        const hostAuthentication = await authenticateHost(
          this.deviceSerialNumber,
          randNum2
        )

        const hostAuthSecrets = hostAuthentication.data

        this.connectionProgress += '<br>► Host authentication in progress...'

        if (hostAuthSecrets.c2 && hostAuthSecrets.nk) {
          const hAuthCommand = hostAuthCommand(
            hostAuthSecrets.c2,
            hostAuthSecrets.nk
          )

          mixinProtocol(this.deviceConnectionProtocol).writeToMote(JSON.stringify(hAuthCommand), this.deviceComPortName, data => {
            if (typeof data === 'object' && data.hasOwnProperty('error')) {
              this.comPortConnectionErrorHandling(data)
              return
            }

            const resp = JSON.parse(data)

            if (resp.Response !== 0) {
              this.connectionProgress += '<br>✖ Device unable to execute command'
              this.error = true
              return
            }

            this.connectionProgress += '<br>✔ Host authentication successful'
            this.progressbarPercentage += 40

            if (this.deviceType === 'peripheral') {
              this.checkPeripheralDmkStatus()
            } else {
              this.checkGatewayDmkStatus()
            }
          })
        } else {
          this.connectionProgress += '<br>✖ Backend unable to generate NK & C2'
          this.error = true
        }
      } catch ({ response }) {
        this.errorAlertDialog = true
        this.errorDialogMessage = response.data.FailureDescription || 'Host Authentication failed'
        this.developerErrorMessage = JSON.stringify(response.data)
      }
    },

    /**
     * 3.A PERIPHERAL RELATED
     * @description (Periphearl/Mote/Device) checking DMK status else inject fresh
     * Step-1A: Check Status
     * Step-2A: If blank then inject DMK
     */
    async checkPeripheralDmkStatus () {
      try {
        this.connectionProgress += '<br>► Checking device authentication status'

        const encryptedCommand = await encrypt(
          this.deviceSerialNumber,
          JSON.stringify(getNetworkConfigCommand())
        )

        mixinProtocol(this.deviceConnectionProtocol).writeToMote(encryptedCommand.data.data, this.deviceComPortName, data => {
          if (typeof data === 'object' && data.hasOwnProperty('error')) {
            this.comPortConnectionErrorHandling(data)
            return
          }

          decrypt(this.deviceSerialNumber, data).then(response => {
            const { Parameters } = JSON.parse(response.data.data)

            this.$store.dispatch(MOTE_NETWORK_CONFIG, Parameters)

            Number(Parameters.Ready) === 0
              ? this.injectDmkToPeripheral()
              : this.navigateToMoteSetupHomePage()
          })
        })
      } catch ({ response }) {
        this.errorAlertDialog = true
        this.errorDialogMessage = response.data.FailureDescription || 'DMK Status verification error'
        this.developerErrorMessage = JSON.stringify(response.data)
      }
    },

    /** Inject DMK to peripheral */
    async injectDmkToPeripheral () {
      this.connectionProgress += '<br>► Injecting initial credentials'

      const initialCredentials = await moteEncryptedCredentials(this.deviceSerialNumber)

      mixinProtocol(this.deviceConnectionProtocol).writeToMote(initialCredentials.data.data, this.deviceComPortName, dmkResponse => {
        if (typeof dmkResponse === 'object' && dmkResponse.hasOwnProperty('error')) {
          this.comPortConnectionErrorHandling(dmkResponse)
          return
        }

        decrypt(this.deviceSerialNumber, dmkResponse).then(response => {
          const { Response } = JSON.parse(response.data.data)
          if (Response === 0) {
            this.connectionProgress += '<br>✔ Credentials injection successful'
            this.navigateToMoteSetupHomePage()
          } else {
            this.connectionProgress += '<br>✖ Credentials injection failed'
            this.error = true
          }
        })
      })
    },

    /**
     * 3.B GATEWAY RELATED
     * @description (Gateway/Box) checking MAT/DMK status else inject fresh key
     * Step-1B: Check status
     * Step-2B: If blank then inject MAT
     */
    async checkGatewayDmkStatus () {
      try {
        this.connectionProgress += '<br>► Checking edge-core authentication status'

        const gatewayAuthStateCommand = await encrypt(
          this.deviceSerialNumber,
          authentication.getStatus()
        )

        mixinProtocol(this.deviceConnectionProtocol).writeToMote(gatewayAuthStateCommand.data.data, this.deviceComPortName, data => {
          if (typeof data === 'object' && data.hasOwnProperty('error')) {
            this.comPortConnectionErrorHandling(data)
            return
          }

          decrypt(this.deviceSerialNumber, data).then(async response => {
            // TODO: Check response 0 or 1 and block or continue application execution
            const { state } = JSON.parse(response.data.data)

            const gatewayStateId = Number(state)

            if (gatewayStateId === gatewayCommissioningState.BLOCKED) {
              this.unblockGateway()
            } else if (gatewayStateId === gatewayCommissioningState.BLANK) {
              this.injectDmkToGateway()
            } else if (gatewayStateId === gatewayCommissioningState.MANUFACTURED) {
              this.injectDidToGateway()
            } else if (gatewayStateId === gatewayCommissioningState.READY) {
              this.injectCsrToGateway()
            } else {
              this.navigateToGatewaySetupHomePage()
            }
          })
        })
      } catch ({ response }) {
        this.errorAlertDialog = true
        this.errorDialogMessage = response.data.FailureDescription || 'DMK Status verification error'
        this.developerErrorMessage = JSON.stringify(response.data)
      }
    },

    async unblockGateway () {
      try {
        this.connectionProgress += '<br>► EdgeCore is blocked'
        this.connectionProgress += '<br>► Unblocking edge-core'
        const unblockCommandEncrypted = await encrypt(this.deviceSerialNumber, authentication.unblock())

        mixinProtocol(this.deviceConnectionProtocol).writeToMote(unblockCommandEncrypted.data.data, this.deviceComPortName, data => {
          if (typeof data === 'object' && data.hasOwnProperty('error')) {
            this.comPortConnectionErrorHandling(data)
            return
          }

          decrypt(this.deviceSerialNumber, data).then(async response => {
            const { Response } = JSON.parse(response.data.data)

            if (Response !== 0) {
              this.connectionProgress += '<br>✖ EdgeCore unblock failed'
              return
            }

            await unlockGatewayOnBackend(this.deviceSerialNumber)
            this.connectionProgress += '<br>► Unblocking edge-core complete'
            await this.injectDmkToGateway()
          })
        })
      } catch (e) {
        console.log(e)
      }
    },

    async injectDmkToGateway () {
      const isGatewayBlankAtBackend = this.gatewayBackendRetrievedInfo.status === 'Blank / Newly Imported'

      if (!isGatewayBlankAtBackend) {
        this.connectionProgress += '<br>► EdgeCore state mismatch reprovision device'
        return
      }

      const initialCredentials = await gatewayEncryptedCredentials(this.deviceSerialNumber)

      this.connectionProgress += '<br>► Injecting initial credentials'

      mixinProtocol(this.deviceConnectionProtocol).writeToMote(initialCredentials.data.data, this.deviceComPortName, dmkResponse => {
        if (typeof dmkResponse === 'object' && dmkResponse.hasOwnProperty('error')) {
          this.comPortConnectionErrorHandling(dmkResponse)
          return
        }

        decrypt(this.deviceSerialNumber, dmkResponse).then(async response => {
          const { Response, state } = JSON.parse(response.data.data)
          if (Response === 0 && state !== gatewayCommissioningState.BLANK) {
            this.connectionProgress += '<br>✔ Credentials injection successful'
            await this.updateBackedStateAfterGatewayMatInjection()
            setTimeout(async () => {
              await this.injectDidToGateway()
            }, 900)
          } else {
            this.connectionProgress += '<br>✖ Credentials injection failed'
            this.error = true
          }
        })
      })
    },

    async updateBackedStateAfterGatewayMatInjection () {
      try {
        this.connectionProgress += '<br>► Updating backend state'
        await updateBackendOnMatInjectionSuccess(this.deviceSerialNumber)
        this.connectionProgress += '<br>✔ Updated backend state'
      } catch (e) {
        this.connectionProgress += '<br>✖ Couldnot update backend state'
        this.error = true
      }
    },

    async injectDidToGateway () {
      const didInformation = await gatewayDid(this.deviceSerialNumber)

      this.connectionProgress += '<br>► Supplying DID information'

      mixinProtocol(this.deviceConnectionProtocol).writeToMote(didInformation.data.data, this.deviceComPortName, didResponse => {
        if (typeof didResponse === 'object' && didResponse.hasOwnProperty('error')) {
          this.comPortConnectionErrorHandling(didResponse)
          return
        }

        decrypt(this.deviceSerialNumber, didResponse).then(async response => {
          const { Response } = JSON.parse(response.data.data)
          if (Response === 0) {
            this.connectionProgress += '<br>✔ Deployment information has been loaded'
            this.injectCsrToGateway()
          } else {
            this.connectionProgress += '<br>✖ Device failed to load deployment information'
            this.error = true
          }
        })
      })
    },

    async injectCsrToGateway () {
      const initialCredentials = await gatewayCsr(this.deviceSerialNumber)

      this.connectionProgress += '<br>► Injecting CSR'

      mixinProtocol(this.deviceConnectionProtocol).writeToMote(initialCredentials.data.data, this.deviceComPortName, dmkResponse => {
        if (typeof dmkResponse === 'object' && dmkResponse.hasOwnProperty('error')) {
          this.comPortConnectionErrorHandling(dmkResponse)
          return
        }

        decrypt(this.deviceSerialNumber, dmkResponse).then(async response => {
          const { Response } = JSON.parse(response.data.data)
          if (Response === 0) {
            this.connectionProgress += '<br>✔ CSR injection successful'
            this.navigateToGatewaySetupHomePage()
          } else {
            this.connectionProgress += '<br>✖ CSR injection failed'
            this.error = true
          }
        })
      })
    },

    navigateToMoteSetupHomePage () {
      console.log('Navigation to mote setup home page')
      this.connectionProgress += '<br> - <br>► Navigating to configurations page'
      this.progressbarPercentage += 50
      setTimeout(() => this.$router.push('/mote/setup_home'), 800)
    },

    navigateToGatewaySetupHomePage () {
      this.connectionProgress += '<br> - <br>► Navigating to configurations page'
      this.progressbarPercentage += 50
      setTimeout(() => this.$router.push('/gateway/setup_home'), 800)
    }
  },
  async created () {
    if (!VueOnline.isOnline) {
      return
    }
    setTimeout(async () => {
      await this.initDeviceHostMutualAuthentication()
    }, 1000)
    // this.navigateToGatewaySetupHomePage()
    // this.navigateToMoteSetupHomePage()

    // 'deviceConnectionProtocol', 'deviceComPortName', 'deviceTcpConnectionIpAddress'
  }
}
</script>

<style scoped>
#mcp .el-header {
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: space-around;
  background-color: #e8ecef;
  color: #545c64;
  height: 100px !important;
}
#mcp .el-main {
  padding: 40px;
}
#mcp-box-card {
  width: 400px;
  margin: 0 auto;
}
#mcp-main .el-card {
  border: 0 !important;
}
#mcp-main .connection-progress {
  padding: 8px;
  margin: 20px 0;
  background: #2b2b2b;
  font-size: 12px;
  color: #ffc66d;
  height: 240px;
}
#developer-message {
  border: 1px solid #b8b8b8;
  margin-top: 20px;
  padding: 5px 5px;
}
</style>
