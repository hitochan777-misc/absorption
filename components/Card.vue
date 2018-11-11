<template>
  <div class="card item">
    <header class="card-header">
      <p class="card-header-title">
        <span class="avator"> {{ authorInitial }} </span>
        {{ card.content }}
        <a 
          v-if="isLiked" 
          class="thumbup" 
          @click="$emit('unlike', card, index)">
          <b-icon icon="thumb-up" />
        </a>
        <a 
          v-else 
          class="thumbup" 
          @click="$emit('like', card)">
          <b-icon icon="thumb-up-outline" />
        </a>
        {{ card.like.length }}
      </p>
      <a 
        class="card-header-icon delete-link" 
        @click="$emit('removeCard', card, index)">
        <span class="delete"/>
      </a>
    </header>
  </div>
</template>

<style>
.thumbup {
  padding-left: 10px;
}

.avator {
  width: 30px;
  border-radius: 2px 10px 2px;
  text-align: center;
  margin-right: 5px;
  background: #bada55;
}
</style>

<script>
export default {
  props: ['card', 'index'],
  computed: {
    authorInitial: function() {
      return this.card.author.substr(0, 1).toUpperCase()
    },
    isLiked: function() {
      return this.card.like.includes(this.$store.state.authUser.username)
    }
  }
}
</script>
