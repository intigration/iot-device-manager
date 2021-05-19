<template>
  <login-form
    v-loading="loading"
    element-loading-text="Loading..."
    element-loading-spinner="el-icon-loading"
    @onLogin="loginUser" class="login-container" />
</template>

<script>
import { AUTH_REQUEST } from '@/store/actions/auth'
import LoginForm from '../components/LoginForm'

export default {
  components: {
    'login-form': LoginForm
  },

  data: () => ({
    loading: false,
    messageType: {
      ERROR: 'error',
      SUCCESS: 'success'
    }
  }),

  methods: {
    loginUser (credentials) {
      this.loading = true
      this.$store.dispatch(AUTH_REQUEST, JSON.stringify(credentials))
        .then(resp => {
          this.loading = false
          this.toast(this.messageType.SUCCESS, 'Login success')
          this.$router.push('/')
        })
        .catch(err => {
          console.log(err)
          this.loading = false
          this.toast(this.messageType.ERROR, 'Login failure, verify Customer Domain, Username or Password')
        })
    },

    toast (type, message) {
      this.$message({
        message,
        type
      })
    }
  }
}
</script>

<style>
  .login-container {
    margin: 150px auto;
    width: 380px;
    padding: 15px 35px 15px 35px;
  }
  /* .el-loading-spinner {
    display: block !important;
  } */
</style>
