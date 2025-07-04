import { defineStore } from "pinia";

interface LayoutState {
    homeView: string;
    homeScroll: number;
    seriesScroll: number;
}

export const useLayoutStore = defineStore("layout", {
    state: (): LayoutState => ({
        homeView: "thumbnail",
        homeScroll: 0,
        seriesScroll: 0,
    }),
    getters: {},
    actions: {
        /**
         * Updates the home view to the specified view.
         * If the current home view is "thumbnail", saves the current scroll position of the main content.
         *
         * @param {string} view - The new view to set as the home view.
         * @return {void} Does not return a value.
         */
        setHomeView(view: string) {
            if (this.homeView === "thumbnail")
                this.homeScroll = document.getElementById("main-content")?.scrollTop ?? 0;
            this.homeView = view;
        },
    },
});
