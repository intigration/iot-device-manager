<template>
  <el-row class="app-bar" type="flex" justify="space-between">
    <el-col style="display: flex; padding-left: 20px;">
      <span class="text-white" style="font-size: 16px; display: flex; align-items: center;">
        <img style="height: 18px; padding-right: 8px;" src="" />
        <h3>M3</h3>
      </span>
    </el-col>
    <el-col class="content-align-right">
      <el-menu
        @select="handleSelect"
        mode="horizontal"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b">
        <el-menu-item v-if="deviceStateConnected === 'true'" index="disconnect" style="border-right: 1px solid #72777d">
          <font-awesome-icon icon="unlink" />
        </el-menu-item>
        <el-submenu index="2">
          <template slot="title">
            <font-awesome-icon icon="user"></font-awesome-icon> &nbsp;
            {{userInfo.firstName}}
          </template>
          <el-menu-item index="2-1" disabled>
            {{userInfo.email}}
          </el-menu-item>
          <el-menu-item index="logout">Log out</el-menu-item>
        </el-submenu>
      </el-menu>
    </el-col>

    <el-dialog
      :visible.sync="alertDialog">
      <span>{{alertDialogMessage}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="default" @click="alertDialog = false">Cancel</el-button>
        <el-button type="primary" @click="alertDialogOnConfirm">Confirm</el-button>
      </span>
    </el-dialog>
  </el-row>
</template>

<script>
import { mapGetters } from 'vuex'
import { DEVICE_STATE_CONNECTED } from '@/store/actions/device'
import { AUTH_LOGOUT } from '@/store/actions/auth'
import { disconnect } from '@/utils/communication/tcp.wrapper'

export default {
  name: 'AppToolbar',
  computed: mapGetters(['userInfo', 'deviceStateConnected', 'deviceConnectionProtocol']),
  data: () => ({
    alertDialog: false,
    alertDialogMessage: '',
    alertDialogOnConfirm: ''
  }),
  methods: {
    handleSelect (key, keyPath) {
      if (key === 'disconnect') {
        this.alertDialog = true
        this.alertDialogMessage = `Are you sure to disconnect ${this.deviceConnectionProtocol} connection?`
        this.alertDialogOnConfirm = this.disconnectSerialConnection
      } else {
        this.alertDialog = true
        this.alertDialogMessage = 'Are you sure to logout from application?'
        this.alertDialogOnConfirm = this.logout
      }
    },

    logout () {
      this.alertDialog = false
      this.$store.dispatch(AUTH_LOGOUT)
        .then(resp => {
          console.log('logout', resp)
        })
        .catch(error => {
          console.log('logout-error', error)
        })
      this.$router.push('/login')
    },

    disconnectSerialConnection () {
      this.alertDialog = false
      this.$store.dispatch(DEVICE_STATE_CONNECTED, false)
      this.$router.push('/')
      disconnect()
    }
  }
}
</script>

<style scopped>
.el-menu.el-menu--horizontal {
  border-bottom: 0px !important;
}
.el-menu--horizontal>.el-submenu .el-submenu__title {
  height: 48px !important;
  line-height: 48px !important;
}
.el-menu--horizontal>.el-menu-item {
  height: 48px !important;
  line-height: 48px !important;
}
.app-bar {
  width: 100%;
  background: #545c64;
  height: 48px;
  display: flex;

}
.content-align-right {
  display: flex;
  justify-content: flex-end;
}
.text-white {
  color: white;
}
</style>
