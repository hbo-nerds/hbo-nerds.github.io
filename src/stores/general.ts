import { useContentStore } from "@/stores/content.ts";
import type { Card } from "@/types/Card.ts";
import type { Playlist } from "@/types/Series.ts";
import { defineStore } from "pinia";
import { event } from "vue-gtag";
import { toast } from "vue3-toastify";

interface GeneralState {
    theme: string;
    view: string;
    sideOpen: boolean;
    likedItems: string[];
    seenItems: string[];
    history: string[];
    searchHistory: string[];
    playlists: Playlist[];
    profile: Profile | null;
}

interface Profile {
    picture: number;
    username: string;
}

export const useGeneralStore = defineStore("general", {
    state: (): GeneralState => ({
        theme: "dark",
        view: "thumbnail",
        sideOpen: false,
        likedItems: [],
        seenItems: [],
        history: [],
        searchHistory: [],
        playlists: [],
        profile: null,
    }),
    getters: {},
    actions: {
        /**
         * Change app theme mode.
         * @param theme "light" | "dark" | "auto"
         */
        setTheme(theme: string) {
            this.theme = theme;
            if (theme === "auto") {
                if (
                    window.matchMedia &&
                    window.matchMedia("(prefers-color-scheme: dark)").matches
                ) {
                    document.documentElement.setAttribute("data-bs-theme", "dark");
                } else document.documentElement.setAttribute("data-bs-theme", "light");
            } else document.documentElement.setAttribute("data-bs-theme", theme);
        },
        /**
         * Change homepage view.
         * @param view
         */
        setView(view: string) {
            this.view = view;
        },
        /**
         * Check for locale storage on page load.
         */
        getLocaleStorage() {
            const parseOrDefault = <T>(key: string, fallback: T): T => {
                try {
                    const value = localStorage.getItem(key);
                    return value ? (JSON.parse(value) as T) : fallback;
                } catch {
                    return fallback;
                }
            };

            this.likedItems = parseOrDefault<string[]>("likedItems", []);
            this.seenItems = parseOrDefault<string[]>("seenItems", []);
            this.history = parseOrDefault<string[]>("history", []);
            this.playlists = parseOrDefault<any[]>("playlists", []);
            this.searchHistory = parseOrDefault<string[]>("searchHistory", []);
            this.profile = parseOrDefault<Profile | null>("profile", null);
        },
        /**
         * Toggle 'like' attribute for given item.
         * @param id id of selected item.
         */
        toggleLikedItem(id: string) {
            if (!this.likedItems.includes(id)) {
                this.likedItems.push(id);
                event("like_item", {
                    item: id,
                });
            } else this.likedItems.splice(this.likedItems.indexOf(id), 1);
            localStorage.setItem("likedItems", JSON.stringify(this.likedItems));
        },
        /**
         * Toggle 'seen' attribute for given item.
         * @param id id of selected item.
         */
        toggleSeenItem(id: string) {
            if (!this.seenItems.includes(id)) this.seenItems.push(id);
            else this.seenItems.splice(this.seenItems.indexOf(id), 1);
            localStorage.setItem("seenItems", JSON.stringify(this.seenItems));
        },
        /**
         * Add item to history.
         * @param id id of selected item.
         */
        updateHistory(id: string) {
            if (this.history.includes(id)) this.history.splice(this.history.indexOf(id), 1);
            this.history.unshift(id);
            if (this.history.length > 10) this.history.pop();
            localStorage.setItem("history", JSON.stringify(this.history));
        },
        /**
         * Add item to search history.
         * @param searchTerm string.
         */
        updateSearchHistory(searchTerm: string) {
            if (this.searchHistory.includes(searchTerm))
                this.searchHistory.splice(this.searchHistory.indexOf(searchTerm), 1);
            this.searchHistory.unshift(searchTerm);
            if (this.searchHistory.length > 20) this.searchHistory.pop();
            localStorage.setItem("searchHistory", JSON.stringify(this.searchHistory));
        },
        /**
         * Remove item from search history.
         * @param search value.
         */
        removeSearchHistory(search: string) {
            let index = this.searchHistory.indexOf(search);
            if (index < 0) return;
            this.searchHistory.splice(index, 1);
            localStorage.setItem("searchHistory", JSON.stringify(this.searchHistory));
        },
        /**
         * Create a new playlist.
         * @param title title of the playlist.
         */
        createPlaylist(title: string) {
            const found = this.playlists.some((pl) => pl.title === title);
            if (!found) this.playlists.push({ title: title, items: [] });
            localStorage.setItem("playlists", JSON.stringify(this.playlists));
            toast(`Afspeellijst ${title} aangemaakt`, {
                position: toast.POSITION.BOTTOM_LEFT,
            });
            // send event to GA4
            event("create_playlist", {
                playlist_name: title,
            });
        },
        /**
         * Updates an existing playlist by replacing it with a new one with the same title.
         * If a playlist with the given title is found, it is updated with the provided playlist object,
         * and the changes are saved to local storage. A confirmation message is displayed via a toast notification.
         *
         * @param {string} title - The title of the playlist to be updated.
         * @param {Playlist} playlist - The updated playlist object to replace the existing one.
         * @return {void}
         */
        editPlaylist(title: string, playlist: Playlist) {
            let idx = this.playlists.findIndex((pl) => pl.title === title);
            if (idx > -1) this.playlists[idx] = playlist;
            localStorage.setItem("playlists", JSON.stringify(this.playlists));
            toast(`Afspeellijst ${playlist.title} opgeslagen`, {
                position: toast.POSITION.BOTTOM_LEFT,
            });
        },
        /**
         * Copy the shared playlist.
         * @param playlist
         */
        copyPlaylist(playlist: Playlist) {
            const found = this.playlists.some((pl) => pl.title === playlist.title);
            if (!found) this.playlists.push(playlist);
            localStorage.setItem("playlists", JSON.stringify(this.playlists));
            toast(`Afspeellijst ${playlist.title} aangemaakt`, {
                position: toast.POSITION.BOTTOM_LEFT,
            });
        },
        /**
         * Delete the playlist by name.
         * @param title title of the playlist.
         */
        deletePlaylist(title: string) {
            if (!window.confirm("Weet je het zeker?")) return;
            const index = this.playlists.findIndex((p) => p.title === title);
            if (index > -1) {
                this.playlists.splice(index, 1);
                toast(`Afspeellijst ${title} verwijderd`, {
                    position: toast.POSITION.BOTTOM_LEFT,
                });
            }
            localStorage.setItem("playlists", JSON.stringify(this.playlists));
        },
        /**
         * Add item to the playlist.
         * @param title title of the playlist.
         * @param itemId id of the selected item.
         */
        togglePlaylistItem(title: string, itemId: string) {
            const playlist = this.playlists.find((pl) => pl.title === title);
            if (!playlist) return;

            if (!playlist.items.includes(itemId)) {
                playlist.items.push(itemId);
                toast(`Toegevoegd aan ${title}`, {
                    position: toast.POSITION.BOTTOM_LEFT,
                });
            } else {
                playlist.items.splice(playlist.items.indexOf(itemId), 1);
                toast(`Verwijderd van ${title}`, {
                    position: toast.POSITION.BOTTOM_LEFT,
                });
            }
            localStorage.setItem("playlists", JSON.stringify(this.playlists));
        },
        /**
         * Find a playlist object with a given name.
         * @param title title of the playlist.
         * @returns {T}
         */
        getPlaylist(title: string) {
            return this.playlists.find((list) => list.title === title);
        },
        /**
         * Find all items in a given array.
         * @param items array containing item ids.
         * @returns {*}
         */
        getPlaylistItems(items: string[] | string): Card[] {
            if (!Array.isArray(items)) items = [items];
            const store = useContentStore();

            let res: Card[] = [];
            items.forEach((id) => {
                const item = store.content.find((c) => c.id === id);
                if (item) res.push(item);
            });
            return res;
        },
        /**
         * Store profile in locale storage.
         * @param profile object containing profile
         */
        storeProfile(profile: Profile) {
            this.profile = profile;
            toast(`Profiel opgeslagen`, {
                position: toast.POSITION.BOTTOM_LEFT,
            });
            localStorage.setItem("profile", JSON.stringify(profile));
        },
        /**
         * Create a JSON file with profile data.
         */
        exportProfile() {
            const userData = {
                likedItems: this.likedItems,
                seenItems: this.seenItems,
                history: this.history,
                searchHistory: this.searchHistory,
                playlists: this.playlists,
                profile: this.profile,
            };

            const a = document.createElement("a");
            const file = new Blob([JSON.stringify(userData, null, 2)], {
                type: "application/json",
            });
            a.href = URL.createObjectURL(file);
            a.download = "mijn-lekker-speuren-data.json";
            a.click();
        },
        /**
         * Set localStorage from an uploaded file.
         * @param userData object containing data to store.
         */
        setLocaleStorageFromFile(userData) {
            try {
                localStorage.setItem("likedItems", JSON.stringify(userData.likedItems || []));
                localStorage.setItem("seenItems", JSON.stringify(userData.seenItems || []));
                localStorage.setItem("history", JSON.stringify(userData.history || []));
                localStorage.setItem("searchHistory", JSON.stringify(userData.searchHistory || []));
                localStorage.setItem("playlists", JSON.stringify(userData.playlists || []));
                localStorage.setItem("profile", JSON.stringify(userData.profile || null));
                toast("Profiel succesvol geïmporteerd");

                this.getLocaleStorage();
            } catch (e) {
                console.error(e);
            }
        },
    },
});
