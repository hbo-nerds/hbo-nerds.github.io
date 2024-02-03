import {defineStore} from "pinia";

export const useGeneralStore = defineStore('general', {
    state: () => ({
        theme: 'dark',
        view: 'thumbnails',
        selectedCard: {
            id: '',
            type: ''
        }
    }),
    getters: {},
    actions: {
        selectCard(id, type) {
            this.selectedCard.id = id
            this.selectedCard.type = type
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