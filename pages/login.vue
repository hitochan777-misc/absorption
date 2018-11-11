<template>
  <section class="hero is-fullheight">
    <nuxt-link :to="{ name: 'graphql' }">graphql</nuxt-link>
    <div class="hero-body">
      <div class="container has-text-centered">
        <div class="column is-4 is-offset-4">
          <div
            v-if="mode === 'Login'"
            class="box">
            <figure class="avatar">
              <img
                class="logo"
                src="@/static/logo.png">
            </figure>
            <div class="field">
              <div class="control">
                <input
                  v-model="username"
                  class="input is-large"
                  type="username"
                  placeholder="Your username"
                  autofocus=""
                  @keypress.enter="login">
                <p
                  v-if="errorUsername"
                  class="help is-danger">
                  {{ errorUsername }}
                </p>
              </div>
            </div>
            <div class="field">
              <div class="control">
                <input
                  v-model="password"
                  class="input is-large"
                  type="password"
                  placeholder="Your password"
                  @keypress.enter="login">
                <p
                  v-if="errorPassword"
                  class="help is-danger">
                  {{ errorPassword }}
                </p>
              </div>
            </div>
            <a
              class="button is-primary is-large is-fullwidth"
              @click="login">Login</a>
            <p
              v-if="errorLogin"
              class="help is-danger">
              {{ errorLogin }}
            </p>
          </div>
          <div
            v-else
            class="box">
            <figure class="avatar">
              <img src="/static/logo.png">
            </figure>
            <div class="field">
              <div class="control">
                <input
                  v-model="username"
                  class="input is-large"
                  type="username"
                  placeholder="Your username"
                  autofocus=""
                  @keypress.enter="signup">
                <p
                  v-if="errorUsername"
                  class="help is-danger">
                  {{ errorUsername }}
                </p>
              </div>
            </div>
            <div class="field">
              <div class="control">
                <input
                  v-model="password"
                  class="input is-large"
                  type="password"
                  placeholder="Your password"
                  @keypress.enter="signup">
                <p
                  v-if="errorPassword"
                  class="help is-danger">
                  {{ errorPassword }}
                </p>
              </div>
            </div>
            <div class="field">
              <div class="control">
                <input
                  v-model="confirmPassword"
                  class="input is-large"
                  type="password"
                  placeholder="Confirm password"
                  @keypress.enter="signup">
                <p
                  v-if="errorConfirmPassword"
                  class="help is-danger">
                  {{ errorConfirmPassword }}
                </p>
              </div>
            </div>
            <a
              class="button is-primary is-large is-fullwidth"
              @click="signup">Sign up</a>
            <p
              v-if="errorLogin"
              class="help is-danger">
              {{ errorLogin }}
            </p>
          </div>
          <p class="has-text-grey">
            <a @click="switchMode('Login')">Login</a> &nbsp;·&nbsp;
            <a @click="switchMode('Sign up')">Sign Up</a>
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  layout: 'login',
  data() {
    return {
      mode: 'Login',
      username: '',
      password: '',
      confirmPassword: '',
      errorUsername: null,
      errorPassword: null,
      errorConfirmPassword: null,
      errorLogin: null
    }
  },
  methods: {
    async login() {
      try {
        this.errorUsername = null
        this.errorPassword = null
        this.errorLogin = null
        if (this.username === '') {
          this.errorUsername = 'This field is required'
        }
        if (this.password === '') {
          this.errorPassword = 'This field is required'
        }
        if (this.errorUsername || this.errorPassword) {
          return
        }
        await this.$store.dispatch('login', {
          username: this.username,
          password: this.password
        })
        this.username = ''
        this.password = ''
        this.errorLogin = null
        this.$router.push('/')
      } catch (e) {
        this.errorLogin = e.message
      }
    },
    async signup() {
      this.errorUsername = null
      this.errorPassword = null
      this.errorConfirmPassword = null
      if (this.username === '') {
        this.errorUsername = 'This field is required'
      }
      if (this.password === '') {
        this.errorPassword = 'This field is required'
      }
      if (this.errorConfirmPassword === '') {
        this.errorConfirmPassword = 'This field is required'
      }
      if (
        this.errorConfirmPassword !== '' &&
        this.password !== this.confirmPassword
      ) {
        this.errorConfirmPassword = 'Password is not matched'
      }
      if (
        this.errorUsername ||
        this.errorPassword ||
        this.errorConfirmPassword
      ) {
        return
      }
      await this.$axios.post('/api/signup', {
        username: this.username,
        password: this.password
      })
      await this.$store.dispatch('login', {
        username: this.username,
        password: this.password
      })
      this.username = ''
      this.password = ''
      this.errorLogin = null
      this.$router.push('/')
    },
    switchMode(newMode) {
      this.mode = newMode
    }
  },
  head() {
    return {
      title: `login`
    }
  }
}
</script>

<style scoped>
.avatar {
  margin-top: -70px;
  padding-bottom: 20px;
}

.logo {
  width: 128px;
  height: 128px;
}
</style>
