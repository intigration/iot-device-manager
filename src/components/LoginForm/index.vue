<template>

  <el-form :model="userLoginForm" ref="userLoginForm" @keyup.enter.native="submitForm('userLoginForm')" label-position="left" label-width="0px" class="demo-dynamic">

    <h3>
      <font-awesome-icon icon="sign-in-alt"></font-awesome-icon> Login <br>
      <small>Device Management Account</small>
    </h3>

    <el-popover
      placement="top-start"
      title="Customer Name"
      width="310"
      trigger="focus"
      content="Input name ie. `develop` instead of full URL">

      <el-form-item
        slot="reference"
        v-popover:popover
        prop="customerName"
        :rules="{ required: true, message: 'Customer name (i.e. develop etc) ', trigger: 'blur' }">
        <el-input
          v-model="userLoginForm.customerName"
          auto-complete="off"
          placeholder="Customer Name">
            <!-- <template slot="append">{{deploymentPath}}</template> -->
          </el-input>
      </el-form-item>
    </el-popover>

    <el-form-item
      prop="userName"
      :rules="{ required: true, message: 'Please input email', trigger: 'blur' }">
      <el-input
        v-model="userLoginForm.userName"
        auto-complete="off"
        placeholder="Email"></el-input>
    </el-form-item>

    <el-form-item
      prop="password"
      :rules="{ required: true, message: 'Please input password', trigger: 'blur' }">
      <el-input
        v-model="userLoginForm.password"
        auto-complete="off"
        placeholder="Password"
        type="password"></el-input>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="submitForm('userLoginForm')">Login</el-button>
    </el-form-item>
  </el-form>

</template>

<script>
import { mapGetters } from 'vuex'
import { RECENT_LOGIN_USERNAME, RECENT_LOGIN_CUSTOMER } from '@/store/actions/auth'

export default {
  data () {
    return {
      userLoginForm: {
        customerName: '',
        userName: '',
        password: ''
      },
      deploymentPath: ''
    }
  },

  computed: {
    ...mapGetters(['appApiServerUrl', 'recentCustomer', 'recentUsername'])
  },

  created () {
    this.deploymentPath = this.appApiServerUrl.replace('api', '')
    this.userLoginForm.userName = this.recentUsername
    this.userLoginForm.customerName = this.recentCustomer.replace(this.appApiServerUrl.replace('api', ''), '')

    this.$store.dispatch(RECENT_LOGIN_USERNAME, this.recentUsername)
    this.$store.dispatch(RECENT_LOGIN_CUSTOMER, this.recentCustomer)
  },

  methods: {
    submitForm (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const postFixCustomerNameWithDeployment = this.userLoginForm.customerName + this.appApiServerUrl.replace('api', '')
          localStorage.setItem('customerName', postFixCustomerNameWithDeployment)
          this.$store.dispatch(RECENT_LOGIN_USERNAME, this.userLoginForm.userName)
          this.$store.dispatch(RECENT_LOGIN_CUSTOMER, postFixCustomerNameWithDeployment)
          this.$emit('onLogin', this.userLoginForm)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style scoped>
.el-form-item {
  margin-bottom: 26px !important;
}

.el-autocomplete {
  width: 100% !important;
}
</style>