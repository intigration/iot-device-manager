<template>
  <el-container id="mlp">

    <el-header>
      <!-- <span>Welcome to Device Setup Application</span> -->
      <div>
        <h3>Choose target device and connection protocol</h3>
      </div>
    </el-header>

    <!-- if no account exist then mean user is in wrong space -->
    <el-alert
      v-if="zeroAccounts"
      title="You don't have access to the given customer resources, try to login again with a correct customer."
      type="error"
      effect="dark"
      close-text="LOGIN"
      @close="onClickCloseZeroAccount()"
      center
      show-icon>
    </el-alert>

    <el-main id="mlp-main">
      <el-card shadow="never" class="box-card">

        <el-form :model="form" :rules="rules" ref="form" label-width="0px" class="demo-ruleForm">
          <el-form-item prop="account">
            <el-select v-model="form.account" placeholder="Choose an account" style="width: 320px" >
              <el-option
                :remote="true"
                v-for="item in dAccounts"
                :key="item.id"
                :label="item.name"
                :value="item.id">
                <span style="float: left">{{ item.name }}</span>
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item prop="deviceType">
            <el-radio-group v-model="form.deviceType" @change="onSelectDeviceType" :disabled="!form.account">
              <el-radio label="gateway" border>Edge Core</el-radio>
              <el-radio label="peripheral" border>Device</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item prop="serial">
              <el-select v-model="form.serial" placeholder="Choose device" style="width: 320px" @change="stopPolling">
                <template v-if="form.deviceType === 'peripheral'">
                  <el-option
                    :remote="true"
                    v-for="item in motes"
                    :key="item.id"
                    :label="item.serialNumber"
                    :value="item.serialNumber"
                    :disabled="!item.box.serialNumber">
                    <span style="float: left">
                      <font-awesome-icon icon="plug"></font-awesome-icon> &nbsp;
                      {{ item.serialNumber }}
                    </span>
                    <span style="float: right">
                      <!-- <el-badge is-dot class="item" :type="item.box.serialNumber ? 'primary':'warning'">

                      </el-badge> -->
                      {{ item.box.serialNumber ? 'Ready' : 'Not-Attached' }}
                    </span>
                  </el-option>
                </template>
                <template v-if="form.deviceType === 'gateway'">
                  <el-option
                    v-for="item in gateways"
                    :remote="true"
                    :key="item.serial"
                    :value="item.serial">
                    <span style="float: left">
                      <font-awesome-icon icon="plug"></font-awesome-icon> &nbsp;
                      {{ item.serial }}
                    </span>
                    <span style="float: right">
                      <el-badge v-if="item.status === 'online'"  is-dot class="item" type="success" />
                      <el-badge v-else-if="item.status === 'offline'" is-dot class="item" type="info" />
                      <el-badge v-else is-dot class="item" type="primary" />
                    </span>
                  </el-option>
                </template>
              </el-select>

          </el-form-item>

          <el-form-item prop="protocol">
            <el-radio-group v-model="form.protocol" @change="onSelectPtotocolType" :disabled="!form.serial">
              <el-popover
                v-if="form.deviceType === 'peripheral'"
                placement="top-start"
                width="240"
                trigger="hover"
                content="Make sure device and DSA are connected to same network.">
                <el-radio border slot="reference" label="TCP">TCP</el-radio>
              </el-popover>

              <el-popover
                v-if="form.deviceType === 'gateway'"
                placement="top-start"
                width="240"
                trigger="hover"
                content="Make sure device and DSA are connected to same network.">
                <el-radio border slot="reference" label="HTTP">HTTP</el-radio>
              </el-popover>

              <el-popover
                v-if="userAgent === 'electron'"
                placement="top-start"
                width="240"
                trigger="hover"
                content="Make sure device and DSA have stable serial connection.">
                <el-radio border slot="reference" label="SERIAL">SERIAL</el-radio>
              </el-popover>
            </el-radio-group>
          </el-form-item>

          <el-form-item v-if="this.form.protocol === 'TCP' || this.form.protocol === 'HTTP'">
            <el-form-item prop="ipAddress">
              <el-input v-model="form.ipAddress" placeholder="Enter valid ip address" :disabled="!form.protocol">
              </el-input>
            </el-form-item>

            <el-form-item prop="tcpPort" class="mt-5">
              <el-input v-model="form.tcpPort" placeholder="Port (Default 8888)" :disabled="!form.protocol">
              </el-input>
            </el-form-item>
          </el-form-item>

          <el-form-item prop="comPort" v-if="this.form.protocol === 'SERIAL'" class="flex justify-between" :disabled="!form.protocol">
            <el-select v-model="form.comPort" placeholder="Please select port" style="width: 217px;">
              <el-option
                v-for="item in serialPorts"
                :key="item.comPort"
                :label="item.comName"
                :value="item.comName"
                v-bind:attr="item.manufacturer === 'Prolific' ? 'selected' : ''">
                <span style="float: left">{{ item.comName }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.manufacturer }}</span>
              </el-option>
            </el-select>
            &nbsp;
            <el-button @click="refreshPorts">Refresh</el-button>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="submitForm('form')">Connect</el-button>
            <el-button @click="resetForm('form')">Reset</el-button>
          </el-form-item>
        </el-form>

      </el-card>
    </el-main>
  </el-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { DEVICE_SERIAL_NUMBER, DEVICE_TYPE, DEVICE_COM_PORT_NAME, DEVICE_STATE_CONNECTED, AOIM_INITIAL_RANDOM_CHALLENGE, DEVICE_IP_ADDRESS, DEVICE_TCP_PORT, DEVICE_CONNECTION_PROTOCOL } from '@/store/actions/device'
import { MOTE_HOST_GATEWAY_IP } from '@/store/actions/mote'
import { GATEWAY_BACKEND_STATE } from '@/store/actions/gateway'
import { USER_ACCOUNT, AUTH_LOGOUT } from '@/store/actions/auth'
import { portList } from '../utils/communication/serial.wrapper' // connect
import { mixinProtocol } from '../utils/communication/protocol'
import { userAccounts } from '../services/UserAccountService'
import { fetchRandomChallenge } from '../services/AoimAuthService'
import { getMotes, getGateways } from '../services/DeviceService'
import VueOnline from '@/utils/is-online'
import { AppInfo } from '@/utils/app-info'

export default {
  created () {
    this.$store.dispatch(DEVICE_STATE_CONNECTED, false)

    const userAgent = navigator.userAgent.toLowerCase()

    if (userAgent.indexOf(' electron/') > -1) {
      this.userAgent = 'electron'
    } else {
      this.userAgent = 'browser'
    }

    // eslint-disable-next-line no-console
    console.log(AppInfo)

    setTimeout(() => {
      this.loadUserAccounts()
    }, 800)
  },
  beforeDestroy () {
    this.stopPolling()
  },
  data: () => ({
    userAgent: '',
    form: {
      deviceType: '',
      serial: '',
      comPort: '',
      account: '',
      protocol: '',
      ipAddress: '',
      tcpPort: '9005'
    },
    rules: {
      deviceType: [
        { required: true, message: 'Please setup device type', trigger: 'blur' }
      ],
      serial: [
        { required: true, message: 'Please select device', trigger: 'blur' }
      ],
      comPort: [
        { required: true, message: 'Please select port', trigger: 'change' }
      ],
      account: [
        { required: true, message: 'Please select account', trigger: 'change' }
      ],
      protocol: [
        { required: true, message: 'Please select communication protocol', trigger: 'change' }
      ],
      ipAddress: [
        { required: true, message: 'Please input valid IP address', trigger: 'change' }
      ],
      tcpPort: [
        { required: true, message: 'Input valid port number', trigger: 'change' }
      ]
    },
    dAccounts: [],
    zeroAccounts: false,
    motes: [],
    gateways: [],
    serialPorts: [],
    motesFetchPolling: null
  }),
  methods: {
    loadUserAccounts () {
      userAccounts(this.userInfo.id)
        .then(resp => {
          let ownedAccounts = []
          for (let i = 0; i < resp.data.length; i++) {
            if (resp.data[i].ccUser.id === Number(this.userInfo.id)) {
              ownedAccounts.push(resp.data[i])
            }
          }
          this.dAccounts = [...ownedAccounts]
          this.zeroAccounts = this.dAccounts.length === 0
        })
        .catch(err => {
          console.log(err)
        })
    },

    async onSelectDeviceType (e) {
      this.$store.dispatch(USER_ACCOUNT, this.form.account)
      this.stopPolling()

      if (e === 'peripheral') {
        this.startPollingMotes()
        this.form.tcpPort = 9005
      } else {
        this.form.serial = ''
        this.form.tcpPort = 9005
        const { data } = await getGateways()
        console.log(data)
        this.gateways = [...data.gateways]
      }
    },

    onSelectPtotocolType (protocol) {
      this.$store.dispatch(DEVICE_CONNECTION_PROTOCOL, protocol)
      if (protocol === 'SERIAL') {
        this.refreshPorts()
      } else {
        this.stopPolling()
      }
    },

    refreshPorts () {
      // this.$forceUpdate()
      this.form.comPort = ''
      portList().then(ports => {
        this.serialPorts = ports
        this.serialPorts.forEach(item => {
          if (item.manufacturer === 'Prolific') {
            this.form.comPort = item.comName
          }
        })
      })
    },
    async submitForm (formName) {
      if (!VueOnline.isOnline) {
        return
      }

      this.$refs[formName].validate(async valid => {
        console.log('is form valid', valid)
        if (valid) {
          const isTcp = () => this.form.protocol === 'TCP'
          const tcpPort = isTcp() && this.form.tcpPort.length > 0 ? this.form.tcpPort : '8888'
          const deviceConnectionIdentifier = isTcp() ? `${this.form.ipAddress}:${tcpPort}` : this.form.comPort
          const protocol = mixinProtocol(this.form.protocol)
          protocol.connect(deviceConnectionIdentifier)

          this.$store.dispatch(DEVICE_SERIAL_NUMBER, this.form.serial)
          this.$store.dispatch(DEVICE_TYPE, this.form.deviceType)
          this.$store.dispatch(MOTE_HOST_GATEWAY_IP, this.selectedMoteHostGatewayIp())
          this.$store.dispatch(DEVICE_COM_PORT_NAME, this.form.comPort)
          this.$store.dispatch(DEVICE_STATE_CONNECTED, true)
          this.$store.dispatch(USER_ACCOUNT, this.form.account)
          this.$store.dispatch(GATEWAY_BACKEND_STATE, this.selectedGateway())
          this.$store.dispatch(DEVICE_IP_ADDRESS, this.form.ipAddress)
          this.$store.dispatch(DEVICE_TCP_PORT, this.form.tcpPort)
          this.$store.dispatch(DEVICE_CONNECTION_PROTOCOL, this.form.protocol)

          this.$store.dispatch(USER_ACCOUNT, this.form.account)

          // fetching random challenge from Backend for AOIM session
          const randomChallengeResp = await fetchRandomChallenge(this.form.deviceType, this.form.serial)
          const { challenge } = randomChallengeResp.data
          this.$store.dispatch(AOIM_INITIAL_RANDOM_CHALLENGE, challenge)

          // finally redirect
          this.$router.push('connection')
        } else {
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
      this.motes = []
      this.refreshPorts()
    },

    selectedMoteHostGatewayIp () {
      if (this.form.deviceType !== 'peripheral') {
        return ''
      }
      const moteSerial = this.form.serial
      const targetMote = this.motes.filter(mote => mote.serialNumber === moteSerial)[0]
      return targetMote.box.privateIp
    },

    selectedGateway () {
      if (this.form.deviceType !== 'gateway') {
        return {}
      }

      const selectGateway = this.gateways.filter(gw => gw.serial === this.form.serial)
      return selectGateway[0] || {}
    },

    stopPolling () {
      if (this.motesFetchPolling !== null) {
        clearInterval(this.motesFetchPolling)
      }
    },
    startPollingMotes () {
      this.stopPolling()
      if (!this.form.account) {
        return
      }

      this.fetchMotes() // first quick fetch
      this.motesFetchPolling = setInterval(() => this.fetchMotes(), 2500) // reset fetch in polling way
    },

    fetchMotes () {
      this.form.serial = ''
      this.$store.dispatch(USER_ACCOUNT, this.form.account)
      getMotes().then(response => {
        // TODO working on stop polling logic
        this.motes = response.data
      })
    },

    onClickCloseZeroAccount () {
      this.$store.dispatch(AUTH_LOGOUT)
        .then(resp => {
          console.log('logout', resp)
          this.$router.push('/login')
        })
        .catch(error => {
          console.log('logout-error', error)
          this.$router.push('/login')
        })
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'userAccountId'])
  }
}
</script>

<style>
.text-white {
  color: white;
}
.el-radio-group {
  display: flex !important;
  justify-content: space-between;
}
#mlp .el-header {
  display: flex;
  align-items: center;
  justify-content: space-around;
  background-color: #e8ecef;
  color: #545c64;
  height: 100px !important;
}
.content-align-right {
  display: flex;
  justify-content: flex-end;
}
.el-main {
  padding: 40px;
}
#mlp-main {
  padding: 60px !important;
}
#mlp-main .box-card {
  width: 360px;
  margin: 0 auto;
}
#mlp-main .el-card {
  border: 0 !important;
}
</style>
