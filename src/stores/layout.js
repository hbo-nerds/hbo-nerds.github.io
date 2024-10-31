import { defineStore } from "pinia";

export const useLayoutStore = defineStore("layout", {
  state: () => ({
    homeView: "thumbnail",
    homeScroll: 0,
    seriesScroll: 0,
  }),
  getters: {},
  actions: {
    setHomeView(payload) {
      if (this.homeView === "thumbnail")
        this.homeScroll = document.getElementById("main-content").scrollTop;
      this.homeView = payload;
    },
  },
});
