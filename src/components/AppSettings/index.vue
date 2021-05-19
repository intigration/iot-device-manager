<template>
  <div>
    <div class="flex flex-row-reverse mr-5 mt-3">
      <el-button type="text" @click="dialogVisible = true" :class="{ 'settings-button--active': dialogVisible }">
        <i class="el-icon-setting"></i> Settings
      </el-button>
    </div>

    <el-dialog title="Application Settings" :visible.sync="dialogVisible" width="50%" :showClose="false" :beforeClose="handleClose">
      <el-form ref="form" :model="form" label-width="auto" @submit="handleClose" @keyup.enter.native="handleClose">
        <el-form-item label="Deployment Url">
          <el-input v-model="form.apiServer" size="medium" style="max-width: 300px;">
            <template slot="prepend">api.</template>
          </el-input>
          <div class="sub-title">Without prefix <code>api.</code> (i.e. m3-solutions.io)</div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">Cancel</el-button>
        <el-button type="primary" @click="handleClose">Save</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { APP_API_SERVER } from '@/store/actions/auth'

export default {
  name: 'AppSetting',

  data: () => ({
    dialogVisible: false,
    form: {
      apiServer: ''
    }
  }),

  computed: mapGetters(['appApiServerUrl']),

  created () {
    this.form.apiServer = this.appApiServerUrl.replace('api.', '')

    const apiEndPoint = localStorage.getItem('app-api-server-url')
    if (!apiEndPoint) {
      this.dialogVisible = true;
    }
  },

  methods: {
    handleClose () {
      if (!this.form.apiServer) {
        return
      }

      const userInputDeploymentPath = this.form.apiServer;
      const finalDeploymentPath = userInputDeploymentPath.startsWith('api.') ? userInputDeploymentPath : `api.${userInputDeploymentPath}`

      this.$store.dispatch(APP_API_SERVER, finalDeploymentPath)
      localStorage.setItem('app-api-server-url', finalDeploymentPath)
      this.dialogVisible = false
    }
  }
}
</script>

<style>
  .settings-button--active {
    border: #F9AA33 2px solid;
    padding: 4px;
  }
</style>