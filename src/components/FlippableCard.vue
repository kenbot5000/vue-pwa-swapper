<template>
  <v-card class="d-flex justify-center my-n2 mx-n4" @click="flipCard" width="100px" height="100px">
    <v-img :src="srcString"></v-img>
  </v-card>
</template>

<script>
export default {
  props: ['cardData', 'flipped'],
  computed: {
    srcString () {
      return this.flipped ? require(`@/assets/${this.cardData}.jpg`) : require("@/assets/ccGudakoMercy.png")
    }
  },
  methods: {
    flipCard() {
      if(!this.flipped) {
        this.$emit('flip-card', this.cardData)
      } else {
        this.$emit('unflip', this.cardData)
      }
      this.flipped = !this.flipped
    },
    lock () {
      this.flipped = true
      this.disabled = true
    }
  }
}
</script>

<style>

</style>