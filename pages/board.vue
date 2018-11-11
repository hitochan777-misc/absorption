<template>
  <div>
    <nav class="level">
      <div class="level-left">
        <h1 class="title ">{{ title }}</h1>
      </div>
      <div class="level-right">
        <input
          v-model="listTitle"
          class="input column"
          type="text"
          placeholder="list title here"
          @keypress.enter="addList"
        >
        <a
          class="column is-2"
          @click="addList">
          <b-icon icon="table-column-plus-before" />
        </a>
      </div>
    </nav>
    <draggable
      :list="lists"
      :options="{draggable: '.list', group: 'list'}"
      class="columns scrolling-wrapper"
      @start="onDragStart"
      @end="onDragEnd"
      @change="moveList"
    >
      <List
        v-for="(list, index) in lists"
        :title="list.title"
        :board-id="boardId"
        :list-id="list.id"
        :cards="cards[list.id]"
        :key="index"
        class="list"
        @remove-list="removeList"
      />
    </draggable>
  </div>
</template>

<script>
import gql from 'graphql-tag'
import draggable from 'vuedraggable'
import _ from 'lodash'
import uuid from 'uuid/v1'

import List from '~/components/List.vue'

export default {
  apollo: {
    cardss: {
      query: gql`
        query lists($boardId: String!) {
          lists(boardId: $boardId) {
            id
            order
            boardId
            listId
            content
            like
            author
          }
        }
      `,
      variables() {
        return { boardId: '1' }
      }
    }
  },
  components: {
    draggable,
    List
  },
  data() {
    return {
      cards: {},
      lists: [],
      listTitle: ''
    }
  },
  fetch({ store, redirect }) {
    if (!store.state.authUser) {
      return redirect('/login')
    }
  },
  async asyncData({ app, params }) {
    const boardId = params.id
    let listsData = await app.$axios.get(`/api/lists?boardId=${boardId}`)
    let cardsData = await app.$axios.get(`/api/cards?boardId=${boardId}`)

    let lists = _.sortBy(listsData.data, ['order'])
    let cards = {}
    for (let list of lists) {
      cards[list.id] = []
    }

    _.orderBy(cardsData.data, ['listId', 'order'], ['asc', 'asc']).forEach(
      card => {
        cards[card.listId].push(card)
      }
    )
    return { cards, lists, boardId, title: params.title }
  },
  head() {
    return {
      title: 'Retrospective board'
    }
  },
  methods: {
    addList: function() {
      if (this.listTitle === '') {
        return
      }
      const newList = {
        id: uuid(),
        boardId: this.boardId,
        order: this.lists.length,
        title: this.listTitle
      }
      this.lists.push(newList)
      this.cards[newList.id] = []
      axios.post('/api/lists', newList)
      this.listTitle = ''
    },
    moveList: function(event) {
      let order = 0
      for (let i = event.moved.newIndex; i < this.lists.length; i++) {
        if (i !== 0) {
          order = this.lists[i - 1].order + 1
        }
        this.lists[i].order = order
        axios.put('/api/lists/' + this.lists[i].id, this.lists[i])
      }
    },
    removeList: function(listid) {
      let index = _.findIndex(this.lists, ['id', listid])
      this.lists.splice(index, 1)
      axios.delete(`/api/lists/${listid}`)
    },
    onDragStart: function(event) {
      event.item.style.opacity = '0.4'
    },
    onDragEnd: function(event) {
      event.item.style.opacity = '1'
    }
  }
}
</script>

<style scoped>
.scrolling-wrapper {
  overflow-x: scroll;
  overflow-y: hidden;
  white-space: nowrap;
}
</style>
