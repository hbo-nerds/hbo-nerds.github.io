import { defineStore } from "pinia";

export const useLayoutStore = defineStore("layout", {
  state: () => ({
    homeScroll: 0,
    seriesScroll: 0,
  }),
  getters: {},
  actions: {},
});
