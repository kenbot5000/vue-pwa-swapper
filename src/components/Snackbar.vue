<template>
  <v-snackbar v-model="snackbar" timeout="2000">
    {{ snackbarMessage }}
    <template #action="{ attrs }">
      <v-btn
        color="blue"
        text
        v-bind="attrs"
        @click="snackbar = false"
      >
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
export default {
  data () {
    return {
      snackbar: false,
      snackbarMessage: ''
    }
  },
  methods: {
    sendMessage (message) {
      this.snackbar = true
      this.snackbarMessage = message
    }
  }
}
</script>

<style>

</style>
