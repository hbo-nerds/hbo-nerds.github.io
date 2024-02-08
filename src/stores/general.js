import {defineStore} from "pinia";

export const useGeneralStore = defineStore('general', {
    state: () => ({
        theme: 'dark',
        view: 'thumbnails',
        selectedCard: null
    }),
    getters: {},
    actions: {
        selectCard(id) {
            this.selectedCard = id
        },
        setTheme(theme) {
            this.theme = theme;
            document.documentElement.setAttribute('data-bs-theme', theme);
        },
        setView(view) {
            this.view = view
        }
    }
})