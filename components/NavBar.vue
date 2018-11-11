<template>
  <nav class="navbar is-primary">
    <div class="navbar-brand">
      <nuxt-link :to="{ name: 'index' }">
        <p 
          class="navbar-item title is-3" 
          style="color:white">Retrospective board</p>
      </nuxt-link>
    </div>
    <div class="navbar-menu">
      <div class="navbar-end">
        <div class="navbar-item has-dropdown is-hoverable">
          <a class="navbar-link">{{ username }}</a>
          <div class="navbar-dropdown">
            <a 
              class="navbar-item" 
              @click="logout">Logout</a>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  computed: {
    username: function() {
      if (this.$store.state.authUser && this.$store.state.authUser.username) {
        return this.$store.state.authUser.username
      }
      return ''
    }
  },
  methods: {
    async logout() {
      await this.$store.dispatch('logout')
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
.navbar {
  z-index: 2;
}
</style>
