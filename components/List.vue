<template>
  <div class="column">
    <div class="hero is-primary">
      <div 
        class="hero-body" 
        style="position:relative;">
        <h1 class="title">
          {{ title }}
        </h1>
        <a 
          class="delete-link" 
          style="position: absolute; right:10px; top:10px;" 
          @click="$emit('remove-list', listId)">
          <span class="delete"/>
        </a>
      </div>
    </div>
    <div class="card">
      <div class="box">
        <textarea 
          v-model="newcontent" 
          class="textarea" 
          placeholder="input content here"/>
        <nav class="level">
          <div class="level-left"/>
          <div class="level-right">
            <p class="level-item">
              <a 
                class="button is-primary is-rounded" 
                @click="addCard">Add Card</a>
            </p>
          </div>
        </nav>
      </div>
    </div>
    <draggable 
      :list="cards" 
      :options="{draggable:'.item', group:'card'}" 
      class="draggable" 
      @start="onDragStart" 
      @end="onDragEnd" 
      @change="moveCard">
      <Card 
        v-for="(card, index) in cards" 
        :key="index"
        :card="card" 
        :index="index" 
        @removeCard="removeCard"
        @like="like" 
        @unlike="unlike" />
    </draggable>
  </div>
</template>

<script>
import gql from 'graphql-tag'
import uuid from 'uuid/v1'
import _ from 'lodash'
import draggable from 'vuedraggable'
import Card from '~/components/Card'

export default {
  components: {
    draggable,
    Card
  },
  props: ['boardId', 'listId', 'title', 'cards'],
  data() {
    return {
      newcontent: ''
    }
  },
  methods: {
    addCard: function() {
      if (this.newcontent === '') {
        return
      }
      const id = uuid()
      const newCard = {
        id,
        listId: this.listId,
        boardId: this.boardId,
        content: this.newcontent,
        like: [],
        author: this.$store.state.authUser.username
      }
      this.cards.push(newCard)
      this.$axios.post('/api/cards', newCard)
      this.newcontent = ''
    },
    removeCard: function(card, index) {
      this.cards.splice(index, 1)
      this.$axios.delete(`/api/cards/${card.id}`)
    },
    moveCard: function(event) {
      if (event.moved) {
        let order = 0
        for (let i = event.moved.newIndex; i < this.cards.length; i++) {
          if (i !== 0) {
            order = this.cards[i - 1].order + 1
          }
          this.cards[i].order = order
          this.$axios.put('/api/cards/' + this.cards[i].id, this.cards[i])
        }
      }
      if (event.added) {
        let order = 0
        for (let i = event.added.newIndex; i < this.cards.length; i++) {
          if (i !== 0) {
            order = this.cards[i - 1].order + 1
          }
          this.cards[i].order = order
          this.cards[i].listId = this.listId
          this.$axios.put('/api/cards/' + this.cards[i].id, this.cards[i])
        }
      }
    },
    onDragStart: function(event) {
      event.item.style.opacity = '0.4'
    },
    onDragEnd: function(event) {
      event.item.style.opacity = '1'
    },
    like: function(card) {
      card.like.push(this.$store.state.authUser.username)
      this.$axios.post(`/api/cards/${card.id}/like`)
    },
    unlike: function(card, index) {
      const usename = this.$store.state.authUser.username
      card.like = _.remove(card.like, function(user) {
        return usename !== user
      })
      this.$axios.delete(`/api/cards/${card.id}/like`)
    }
  }
}
</script>

<style scoped>
.button {
  margin-top: 10px;
}

.draggable {
  min-height: 100px;
}

.delete-link {
  display: none;
}

.item:hover > header > .delete-link {
  display: block;
}

.hero-body:hover > .delete-link {
  display: block;
}
</style>
