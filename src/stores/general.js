import {defineStore} from "pinia";

export const useGeneralStore = defineStore('general', {
  state: () => ({
    selectedCard: {
      id: '',
      type: ''
    }
  }),
  getters: {

  },
  actions: {
    selectCard(id, type) {
      this.selectedCard.id = id
      this.selectedCard.type = type
    }
  }
})