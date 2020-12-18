<template>
  <v-app app>
    <Snackbar ref="snackbar" />
    <v-app-bar app dense color="orange">
      <v-toolbar-title class="white--text">GudaFlip</v-toolbar-title>
    </v-app-bar>
    <v-main>
      <v-container id="mainContainer">
      <v-row v-for="(cardSet, index) in cardsChunks" :key="'r-'+index" class="justify-center">
        <v-col v-for="(card, cIndex) in cardSet" :key="'c-'+cIndex" class="d-flex justify-center">
            <FlippableCard :card-data="card" :flipped=false @flip-card='addCard' @unflip="unflip" ref="card" />
        </v-col>
    </v-row>
    </v-container>
    </v-main>
  </v-app>
</template>

<script>
import FlippableCard from '@/components/FlippableCard'
import Snackbar from '@/components/Snackbar'

export default {
  name: 'App',
  components: {
    FlippableCard,
    Snackbar
  },
  data: () => ({
    cards: [],
    cardsChunks: [],
    flippedCards: [],
    matchedCards: []
  }),
  created () {
    this.newGame()
  },
  methods: {
    shuffleArray() {
      let curId = this.cards.length;
      while (0 !== curId) {
        let randId = Math.floor(Math.random() * curId);
        curId -= 1;
        let tmp = this.cards[curId];
        this.cards[curId] = this.cards[randId];
        this.cards[randId] = tmp;
      }
    },
    newGame() {
      for(let i = 0; i < 6; i++) {
      this.cards.push(i)
      this.cards.push(i)
      }
    this.shuffleArray()
    this.cardsChunks.push(this.cards.slice(0,3))
    this.cardsChunks.push(this.cards.slice(3,6))
    this.cardsChunks.push(this.cards.slice(6,9))
    this.cardsChunks.push(this.cards.slice(9))
    console.log(this.cardsChunks)
    },
    addCard(data) {
      this.flippedCards.push(data)
      console.log(this.flippedCards)
      if(this.flippedCards.length >= 2) {
        if(this.flippedCards[0] == this.flippedCards[1]) {
            this.matchedCards.push(this.flippedCards[0])
            this.matchedCards.push(this.flippedCards[1])
            if(this.matchedCards.length == this.cards.length) {
              this.$refs.snackbar.sendMessage('YOU WIN!')
            } else {
              this.$refs.snackbar.sendMessage('MATCH!')
            }
            this.flippedCards = []
        } else {
          setTimeout(() => {
            this.flippedCards = []
            this.matchedCards = []
            for(let card of this.$refs.card) {
            card._props.flipped = false
          }
          }, 1000)
        }
      }
    },
    unflip (data) {
      let index = this.flippedCards.indexOf(data)
      this.flippedCards.splice(index, 1)
      console.log(this.flippedCards)
    }
  }
}
</script>

<style>
</style>
