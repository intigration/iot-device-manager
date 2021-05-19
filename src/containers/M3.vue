<template>
  <div id="app">
    <el-alert
      class="setup-postions"
      :title="statusMessage"
      type="error"
      :closable="false"
      v-if="!isOnline"
      center>
    </el-alert>
    <app-setting v-if="!isAuthenticated" />
    <app-toolbar v-if="isAuthenticated" />
    <el-button @click="startHacking">Start</el-button>
    <router-view></router-view>
    <div class="app-version">Version - {{appVersion}}</div>
  </div>
</template>

<script>
  import VueOnline from '@/utils/is-online'
  import AppToolbar from '@/components/AppToolbar'
  import AppSetting from '@/components/AppSetting'
  import store from '@/store/index'
  import { AppInfo } from '@/utils/app-info'

  export default {
    name: 'mote-setup-app',
    props: ['message'],
    components: {
      AppToolbar,
      AppSetting
    },
    computed: {
      isAuthenticated () {
        return store.getters.isAuthenticated
      },
      isOnline () {
        return VueOnline.isOnline
      },
      statusMessage () {
        if (typeof this.message !== 'undefined') {
          return this.message
        }
        return 'You are offline.'
      },
      appVersion () {
        return AppInfo.version
      }
    }
  }
</script>

<style>
  body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }
  .el-alert--error {
    background: #cd0930;
    border: 0px !important;
    border-radius: 0px;
    color: white
  }
  .setup-postions {
    position: absolute;
    z-index: 999;
    bottom: 0;
  }
  .app-version {
    position: absolute;
    bottom: 10px;
    text-align: center;
    width: 100%;
    font-size: 11px;
    color: gray;
  }
  .el-popover {
    word-break: unset !important;
    text-align: start !important;
  }
  .el-dialog__body {
    word-break: unset !important;
  }
</style>
