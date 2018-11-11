<template>
  <div class="section columns is-multiline">
    <div
      v-for="(board, index) in boards"
      :key="index"
      class="column is-3"
      style="position:relative;">
      <nuxt-link :to="{ name: 'board' , params: { id: board.id, title: board.title}}">
        <article class="tile is-child notification is-primary">
          <p class="title">{{ board.title }}</p>
        </article>
      </nuxt-link>
      <a
        class="delete-link"
        style="position: absolute; right:20px; top:20px;"
        @click="removeBoard(board.id)">
        <span class="delete"/>
      </a>
    </div>
    <div class="column is-3">
      <article class="tile is-child notification is-primary">
        <div class="field has-addons">
          <p
            class="control"
            style="width:100%">
            <input
              v-model="boardTitle"
              class="input"
              type="text"
              placeholder="input board title here">
          </p>
          <p class="control">
            <button
              class="button"
              @click="addBorad">Add</button>
          </p>
        </div>
      </article>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import uuid from 'uuid/v1'

export default {
  data() {
    return {
      boards: [],
      boardTitle: ''
    }
  },
  fetch({ store, redirect }) {
    if (!store.state.authUser) {
      return redirect('/login')
    }
  },
  async asyncData({ app }) {
    let boardsData = await app.$axios.get('/api/boards')
    let boards = _.sortBy(boardsData.data, ['order'])
    return { boards }
  },
  methods: {
    addBorad: function() {
      if (this.boardTitle === '') {
        return
      }
      const newBoard = {
        id: uuid(),
        order: this.boards.length,
        title: this.boardTitle
      }
      this.boards.push(newBoard)
      this.$axios.post('/api/boards', newBoard)
      this.boardTitle = ''
    },
    removeBoard: function(id) {
      let index = _.findIndex(this.boards, ['id', id])
      this.boards.splice(index, 1)
      this.$axios.delete(`/api/boards/${id}`)
    }
  }
}
</script>

<style scoped>
</style>
