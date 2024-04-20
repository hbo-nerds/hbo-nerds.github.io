import {defineStore} from "pinia";
import {useContentStore} from "@/stores/content.js";
import { event } from 'vue-gtag'

export const useGeneralStore = defineStore('general', {
    state: () => ({
        theme: 'dark',
        view: 'search',
        pageSize: 24,
        pageNumber: 0,
        pageNumberSeries: 0,
        likedItems: [],
        seenItems: [],
        history: [],
        playlists: []
    }),
    getters: {},
    actions: {
        /**
         * Change app color mode
         * @param theme
         */
        setTheme(theme) {
            this.theme = theme;
            if (theme === 'auto') {
                if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    document.documentElement.setAttribute('data-bs-theme', 'dark');
                } else
                    document.documentElement.setAttribute('data-bs-theme', 'light');
            } else
                document.documentElement.setAttribute('data-bs-theme', theme);
        },
        setView(view) {
            this.view = view
        },
        /**
         * Get locale storage on page load
         */
        getLocaleStorage() {
            this.likedItems = JSON.parse(localStorage.getItem("likedItems")) || [];
            this.seenItems = JSON.parse(localStorage.getItem("seenItems")) || [];
            this.history = JSON.parse(localStorage.getItem("history")) || [];
            this.playlists = JSON.parse(localStorage.getItem("playlists")) || [];
        },
        /**
         * Toggle 'like' attribute for given item
         * @param id
         */
        toggleLikedItem(id) {
            if (!this.likedItems.includes(id)) {
                this.likedItems.push(id);
                event('like_item', {
                    'item': id
                })
            } else
                this.likedItems.splice(this.likedItems.indexOf(id), 1);
            localStorage.setItem("likedItems", JSON.stringify(this.likedItems));
        },
        /**
         * Toggle 'seen' attribute for given item
         * @param id
         */
        toggleSeenItem(id) {
            if (!this.seenItems.includes(id))
                this.seenItems.push(id);
            else
                this.seenItems.splice(this.seenItems.indexOf(id), 1);
            localStorage.setItem("seenItems", JSON.stringify(this.seenItems));
        },
        updateHistory(id) {
            if(this.history.includes(id))
                this.history.splice(this.history.indexOf(id), 1);
            this.history.unshift(id)
            if (this.history.length > 10)
                this.history.pop()
            localStorage.setItem("history", JSON.stringify(this.history));
        },
        /**
         * Create new playlist
         * @param title
         */
        createPlaylist(title) {
            const found = this.playlists.some(pl => pl.title === title);
            if (!found) this.playlists.push({ title: title, items: [] });
            localStorage.setItem("playlists", JSON.stringify(this.playlists));
            event('create_playlist', {
                'playlist_name': title
            })
        },
        /**
         * Delete playlist by name
         * @param title
         */
        deletePlaylist(title) {
            const index = this.playlists.findIndex(p => p.title === title);
            if (index > -1)
                this.playlists.splice(index, 1);
            localStorage.setItem("playlists", JSON.stringify(this.playlists));
        },
        /**
         * Add item to playlist
         * @param title
         * @param itemId
         */
        togglePlaylistItem(title, itemId) {
            const playlist = this.playlists.find(pl => pl.title === title);
            if (!playlist.items.includes(itemId))
                playlist.items.push(itemId);
            else
                playlist.items.splice(playlist.items.indexOf(itemId), 1);
            localStorage.setItem("playlists", JSON.stringify(this.playlists));
        },
        getPlaylist(title) {
            return this.playlists.find(list => list.title === title)
        },
        /**
         *
         * @param items array containing item ids
         * @returns {*}
         */
        getPlaylistItems(items) {
            const store = useContentStore()
            let res = []
            items.forEach(id => {
                if (store.content.find(c => c.id === id))
                    res.push(store.content.find(c => c.id === id))
            })
            return res
        }
    }
})