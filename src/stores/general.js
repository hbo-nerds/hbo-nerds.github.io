import {defineStore} from "pinia";

export const useGeneralStore = defineStore('general', {
    state: () => ({
        theme: 'dark',
        view: 'search',
        pageSize: 24,
        pageNumber: 0,
        likedItems: []
    }),
    getters: {},
    actions: {
        setTheme(theme) {
            this.theme = theme;
            document.documentElement.setAttribute('data-bs-theme', theme);
        },
        setView(view) {
            this.view = view
        },
        getLikedItems() {
            const arr = JSON.parse(localStorage.getItem("likedItems"))
            this.likedItems = arr ? arr : [];
        },
        setLikedItems() {
            localStorage.setItem("likedItems", JSON.stringify(this.likedItems));
        },
        toggleLikedItem(id) {
            if (!this.likedItems.includes(id))
                this.likedItems.push(id);
            else
                this.likedItems.splice(this.likedItems.indexOf(id), 1);
            this.setLikedItems()
        }
    }
})