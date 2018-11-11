<template>
  <div>
    <a 
      class="button is-primary is-rounded" 
      @click="log">Log</a>
  </div>
</template>

<script>
import gql from 'graphql-tag'

export default {
  apollo: {
    data: {
      prefetch: true,
      query: gql`
        {
          board(id: "1") {
            id
          }
          boards {
            id
            order
            title
          }
          list(id: "1") {
            id
          }
          lists(boardId: "2") {
            id
            order
            title
          }
          card(id: "1") {
            id
          }
          cards(boardId: "1") {
            id
            order
          }
        }
      `,
      update: data => data,
      subscribeToMore: {
        document: gql`
          subscription cardUpdated($param: String) {
            cardUpdated(boardId: $param) {
              id
              content
            }
          }
        `,
        variables() {
          return {
            param: 'this.param'
          }
        },
        updateQuery: (previousResult, { subscriptionData }) => {
          console.log(subscriptionData.data)
        }
      }
    }
  },
  methods: {
    log: function() {
      console.log(this.data)
    }
  }
}
</script>
