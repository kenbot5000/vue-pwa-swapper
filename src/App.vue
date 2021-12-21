<template>
  <v-app app>
    <Snackbar ref="snackbar" />
    <v-dialog v-model="helpDialog" fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar dark color="orange">
          <v-btn
            icon
            dark
            @click="helpDialog = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Help</v-toolbar-title>
        </v-toolbar>
        <v-card-title>
          How to play GudaFlip?
        </v-card-title>
        <v-card-text>
          The rules of GudaFlip are simple. Flip a card to reveal a Servant, and flip another card to compare if it's the same one.
          If it's the same one, they'll stay face up. Otherwise, all of your existing cards will flip back down.
          Remember each of their positions, and reveal all servants to win the game!
        </v-card-text>

        <v-card-title>
          Made by Rionn Kenshin Pineda<br>
          BS701
        </v-card-title>
      </v-card>
      
    </v-dialog>
    
    <!-- High Score -->
    <v-dialog v-model="scoreDialog" fullscreen>
      <v-card>
        <v-toolbar dark color="orange">
          <v-btn icon dark @click="scoreDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>High Scores</v-toolbar-title>
        </v-toolbar>
          
        <ol>
          <li v-for="item in this.highScoreList" :key="item._id">
            {{ item.username }} - {{ item.errorcount }}
          </li>
        </ol>
      </v-card>
    </v-dialog>

    <!-- Score Saving -->
    <v-dialog v-model="recordDialog">
      <v-card>
        <v-card-title>
          Do you want to submit your score?
        </v-card-title>
        <v-row class="mx-4">
          <v-col>
            <v-text-field v-model="username" label="Name"></v-text-field>
          </v-col>
        </v-row>
        <v-card-actions>
          <v-btn color="success" @click="submitScore">Yes!</v-btn>
          <v-btn color="error" @click="recordDialog = false">No thanks</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-app-bar app dense dark color="orange">
      <v-app-bar-nav-icon @click="nav = !nav">
        <v-icon>mdi-menu</v-icon>
      </v-app-bar-nav-icon>
      <v-toolbar-title class="white--text">GudaFlip</v-toolbar-title>
    </v-app-bar>
    <v-navigation-drawer app v-model="nav">
      <v-list nav>
        <v-list-item @click="helpDialog = true">
          <v-list-item-icon>
            <v-icon>mdi-help</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Help</v-list-item-title>
        </v-list-item>
        <v-list-item @click="scoreDialog = true">
          <v-list-item-icon>
            <v-icon>mdi-counter</v-icon>
          </v-list-item-icon>
          <v-list-item-title>High Scores</v-list-item-title>
        </v-list-item>
        <v-list-item @click="newGame">
          <v-list-item-icon>
            <v-icon>mdi-restart</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Reset</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-main class="main-app">
      <!-- <v-img :src="require('@/assets/bg.jpg')" class="bg"></v-img> -->
      <v-row>
        <v-col>
          <v-card outlined>
            <v-card-actions>
              <v-row>
                <v-col>
                  <v-card-title>
                    Mistakes <v-icon color="error">mdi-close-octagon-outline</v-icon> : {{ mistakes }}
                  </v-card-title>
                </v-col>
              </v-row>
              
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
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
import axios from 'axios';

export default {
  name: 'App',
  components: {
    FlippableCard,
    Snackbar
  },
  data: () => ({
    nav: false,
    helpDialog: false,
    cards: [],
    cardsChunks: [],
    flippedCards: [],
    matchedCards: [],
    mistakes: 0,
    scoreDialog: false,
    recordDialog: false,
    username: '',
    highScoreList: [],
  }),
  created () {
    this.newGame()
  },
  computed: {
    cardsEmpty() {
      return this.flippedCards.length == 0;
    },
  },
  watch: {
    async scoreDialog() {
      if (this.scoreDialog) {
        const res = await axios.get(`${process.env.VUE_APP_API_URL}/game/`);
        this.highScoreList = res.data.res;
        this.highScoreList.sort(function(a, b) {
          return a.errorcount - b.errorcount;
        });
      }
    }
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
    async submitScore() {
      const body = {
        username: this.username,
        errorcount: this.mistakes
      }
      const res = await axios.post(`${process.env.VUE_APP_API_URL}/game/`, body);
      if (res) {
        this.$refs.snackbar.sendMessage('Score submitted!')
        this.recordDialog = false;
      }
    },
    newGame() {
      this.cards = [];
      this.matchedCards = [];
      this.cardsChunks = [];
      for(let i = 0; i < 6; i++) {
        this.cards.push(i)
        this.cards.push(i)
      }
      this.mistakes = 0;
      this.shuffleArray()
      this.cardsChunks.push(this.cards.slice(0,3))
      this.cardsChunks.push(this.cards.slice(3,6))
      this.cardsChunks.push(this.cards.slice(6,9))
      this.cardsChunks.push(this.cards.slice(9))
      console.log(this.cardsChunks)
    },
    addCard(data) {
      this.flippedCards.push(data)
      if(this.flippedCards.length >= 2) {
        if(this.flippedCards[0] == this.flippedCards[1]) {
            this.matchedCards.push(this.flippedCards[0])
            this.matchedCards.push(this.flippedCards[1])
            if(this.matchedCards.length == this.cards.length) {
              this.$refs.snackbar.sendMessage('YOU WIN!')
              this.recordDialog = true;
            } else {
              this.$refs.snackbar.sendMessage('MATCH!')
            }
            this.flippedCards = []
        } else {
          setTimeout(() => {
            this.flippedCards = []
            this.matchedCards = []
            this.mistakes += 1;
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
.bg {
  object-fit: cover;
}

.main-app {
  background-image: url('~@/assets/bg.jpg');
  background-size: cover;
}
</style>
