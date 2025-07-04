import { checkWithinWeeks } from "@/helpers/dateFilter.ts";
import { filterCard } from "@/helpers/filter.ts";
import router from "@/router/index.js";
import type { Card } from "@/types/Card.ts";
import type { Duration, FilterOption, Filters, Range, Vod } from "@/types/Filter.ts";
import type { Collection } from "@/types/Series.ts";
import { defineStore } from "pinia";
import { toast } from "vue3-toastify";
import og_data from "../assets/data/data.json";
import { useGeneralStore } from "./general.ts";

interface ContentState {
    collections: Collection[];
    content: Card[];
    filteredData: Card[];
    randomData: Card[];
    search: string;
    sortOption: string;
    sortOptionSeries: string;
    filters: Filters;
    selectedCardId: string | null;
    playlistCardId: string | null;
    shareCardId: string | null;
    sharePlaylistTitle: string | null;
    editPlaylistTitle: string | null;
}

export const useContentStore = defineStore("content", {
    state: (): ContentState => ({
        collections: [],
        content: [],

        filteredData: [],
        randomData: [],
        search: "",
        sortOption: "newOld",
        sortOptionSeries: "newOld",
        filters: {
            type: ["all"],
            platform: ["all"],
            free: false,
            hideSeen: false,
            vod: "all",
            date: {
                range: "all",
                after: "",
                before: "",
            },
            duration: "all",
            activity: [],
            tag: [],
        },
        selectedCardId: null,
        playlistCardId: null,
        shareCardId: null,
        sharePlaylistTitle: null,
        editPlaylistTitle: null,
    }),
    getters: {
        /**
         * Retrieves the currently selected card from the state.
         *
         * @param {Object} state - The application state containing selectedCardId and content.
         * @return {Card|null} The selected card if it exists, otherwise null.
         */
        selectedCard(state): Card | null {
            return state.selectedCardId !== null
                ? (state.content.find((item) => item.id === state.selectedCardId) ?? null)
                : null;
        },
        /**
         * Sort the filtered search data.
         * @returns {*}
         */
        sortedData(state): Card[] {
            return [...state.filteredData].sort((a, b) => {
                if (!state.sortOption) return 0;

                const dateA = new Date(a.date).getTime();
                const dateB = new Date(b.date).getTime();

                switch (state.sortOption) {
                    case "oldNew":
                        return dateA - dateB;
                    case "newOld":
                        return dateB - dateA;
                    case "shortLong":
                        return a.duration - b.duration;
                    case "longShort":
                        return b.duration - a.duration;
                    default:
                        return 0;
                }
            });
        },
        /**
         * Return all collections (items included).
         * @returns {*}
         */
        getCompleteCollections(state): Collection[] {
            return state.collections.map((col) => {
                const id = col.id;
                col.items = this.content.filter((item) => {
                    return item.collection?.includes(id);
                });
                if (col.items.length) {
                    col.created = new Date(col.items[0].date);
                    col.updated = new Date(col.items[col.items.length - 1].date);
                }
                return col;
            });
        },
        /**
         * Group VODs by type.
         * @returns {*}
         */
        groupedTypes(): FilterOption[] {
            return this.content
                .filter((item) => filterCard(item, this.search, ["type"]))
                .reduce(
                    (p, c) => {
                        p[0].count++;
                        const type = c.type;
                        const group = p.find((group) => group.value === type);
                        if (!group) {
                            p.push({ label: type, value: type, count: 1 });
                        } else {
                            group.count++;
                        }
                        return p;
                    },
                    [{ label: "Alle", value: "all", count: 0 }],
                );
        },
        /**
         * Group VODs by platform.
         * @returns {*}
         */
        groupedPlatforms(): FilterOption[] {
            return this.content
                .filter((item) => filterCard(item, this.search, ["platform"]))
                .reduce(
                    (p, c) => {
                        // Making this dynamic would require a change in the JSON to give the platform property a unique prefix/suffix.
                        // Currently _id is also used by twitchtracker_id.
                        // Alternatively, it could be put inside a platform array.
                        // E.g., platforms: [{ name: 'twitch', id: '1234' }, { name: 'youtube', id: '5678' }]
                        p[0].count++;
                        for (const platform of ["twitch", "youtube"]) {
                            if (!c.hasOwnProperty(platform + "_id")) continue;

                            const group = p.find((group) => group.value === platform);
                            if (!group) {
                                p.push({ label: platform, value: platform, count: 1 });
                            } else {
                                group.count++;
                            }
                        }
                        return p;
                    },
                    [{ label: "Alle", value: "all", count: 0 }],
                );
        },
        /**
         * Group VODs by upload date.
         * @returns {*}
         */
        groupedDates(): FilterOption[] {
            return this.content
                .filter((item) => filterCard(item, this.search, ["date"]))
                .reduce(
                    (p, c) => {
                        p[0].count++;
                        if (checkWithinWeeks(c, 1)) p[1].count++;
                        if (checkWithinWeeks(c, 4)) p[2].count++;
                        if (checkWithinWeeks(c, 52)) p[3].count++;
                        return p;
                    },
                    [
                        { label: "Alle", value: "all", count: 0 },
                        { label: "Deze week", value: 1, count: 0 },
                        { label: "Deze maand", value: 4, count: 0 },
                        { label: "Dit jaar", value: 52, count: 0 },
                    ],
                );
        },
        /**
         * Group VODs by duration.
         * @returns {*}
         */
        groupedDuration(): FilterOption[] {
            return this.content
                .filter((item) => filterCard(item, this.search, ["duration"]))
                .reduce(
                    (p, c) => {
                        p[0].count++;
                        if (c.duration / 60 < 20) p[1].count++;
                        if (c.duration / 60 < 60) p[2].count++;
                        if (c.duration / 60 < 120) p[3].count++;
                        if (c.duration / 60 > 120) p[4].count++;
                        return p;
                    },
                    [
                        { label: "Alle", value: "all", count: 0 },
                        { label: "Minder dan 20 minuten", value: 20, count: 0 },
                        { label: "Minder dan 1 uur", value: 60, count: 0 },
                        { label: "Minder dan 2 uur", value: 120, count: 0 },
                        { label: "Meer dan 2 uur", value: "over120", count: 0 },
                    ],
                );
        },
        /**
         * Group VODs by activity.
         * @returns {*}
         */
        groupedActivities(): Record<string, number> {
            return this.content
                .filter((item) => filterCard(item, this.search, ["activity"]))
                .reduce((p, c) => {
                    const act = c.activity || c.activities;
                    if (act === undefined) return p;
                    if (Array.isArray(act)) {
                        act.forEach((a) => {
                            if (typeof a === "string") {
                                if (!p.hasOwnProperty(a)) p[a] = 0;
                                p[a]++;
                            } else {
                                if (!p.hasOwnProperty(a.title)) p[a.title] = 0;
                                p[a.title]++;
                            }
                        });
                        return p;
                    } else {
                        if (!p.hasOwnProperty(act)) p[act] = 0;
                        p[act]++;
                        return p;
                    }
                }, {});
        },
        /**
         * Group VODs by tag.
         * @returns {*}
         */
        groupedTags(): Record<string, number> {
            return this.content
                .filter((item) => filterCard(item, this.search, ["tag"]))
                .reduce((p, c) => {
                    const tags = c.tags;
                    if (tags === undefined) return p;
                    if (tags.length) {
                        tags.forEach((tag) => {
                            if (!p.hasOwnProperty(tag)) p[tag] = 0;
                            p[tag]++;
                        });
                        return p;
                    } else return p;
                }, {});
        },
        /**
         * Return array containing liked items.
         * @returns {*[]}
         */
        likedContent(state: ContentState): Card[] {
            const s = useGeneralStore();
            let res: Card[] = [];
            s.likedItems
                .slice()
                .reverse()
                .forEach((id: string) => {
                    const item = state.content.find((c) => c.id === id);
                    if (item) res.push(item);
                });
            return res;
        },
        /**
         * Return an array containing last visit items.
         * @returns {*[]}
         */
        historyContent(state: ContentState): Card[] {
            const s = useGeneralStore();
            let res: Card[] = [];
            s.history.forEach((id: string) => {
                const item = state.content.find((c) => c.id === id);
                if (item) res.push(item);
            });
            return res;
        },
        /**
         * Get data for heatmap.
         * @returns {*}
         */
        groupedYearDate(): Record<
            number,
            {
                dates: { id: string[]; date: Date; count: number }[];
            }
        > {
            return this.sortedData.reduce(
                (p, c) => {
                    let date = new Date(c.date);
                    let year = date.getFullYear();

                    if (p.hasOwnProperty(year)) {
                        let double = p[year].dates.find((i) => i.date.getTime() === date.getTime());
                        if (double) {
                            double.id.push(c.id);
                            double.count += c.duration;
                        } else {
                            p[year].dates.push({
                                id: [c.id],
                                date: date,
                                count: c.duration,
                            });
                        }
                    } else {
                        p[year] = {
                            dates: [
                                {
                                    id: [c.id],
                                    date: date,
                                    count: c.duration,
                                },
                            ],
                        };
                    }
                    return p;
                },
                {} as Record<number, { dates: { id: string[]; date: Date; count: number }[] }>,
            );
        },
        /**
         * Filters and returns an array of cards that have a `twitch_id`, no `youtube_id`,
         * and are marked as not available on Twitch.
         *
         * @param {ContentState} state - The current content state containing an array of cards.
         * @return {string[]} An array of card ids removed by Twitch's availability status.
         */
        removedByTwitch(state: ContentState): string[] {
            return state.content
                .filter((card: Card) => {
                    return card.twitch_id && !card.youtube_id && !card.twitch_available;
                })
                .map((card) => card.id);
        },
    },
    actions: {
        /**
         * Return a single item by id.
         * @param id id of single item.
         * @returns {*}
         */
        getSingleCard(id: string): Card | null {
            return this.content.find((item) => item.id === id) ?? null;
        },
        /**
         * Return the title for a single card.
         * @param card complete card object.
         * @returns {*}
         */
        getCardTitle(card: Card) {
            if (["podcast", "video"].includes(card.type)) return card.title || "untitled";
            else {
                if (card.custom_title) return card.custom_title;
                else return card.titles?.[0] || "untitled";
            }
        },
        /**
         * Get card thumbnail.
         * @param card
         * @returns {Promise<*|null>}
         */
        async getCardImage(card: Card) {
            const subfolders = [
                "stream_youtube_320px",
                "stream_twitch_320px",
                "video_youtube_320px",
            ];
            let imageSrc: string = "";

            for (const folder of subfolders) {
                let imageName: string | undefined = undefined;

                // Choose the ID based on a folder type
                if (folder.includes("youtube")) {
                    imageName = card.youtube_id;
                } else if (folder.includes("twitch")) {
                    imageName = card.twitch_id;
                }

                if (!imageName) continue;

                let imageUrl: { default: string };

                try {
                    imageUrl = await import(`@/assets/img/thumbnails/${folder}/${imageName}.webp`);
                    if (imageUrl?.default) {
                        imageSrc = imageUrl.default;
                        break;
                    }
                } catch (error) {
                    // Continue to next folder if image is not found
                }
            }

            // Apply fallback logic if no image was found
            if (!imageSrc) {
                try {
                    const fallbackImage =
                        card.youtube_id || card.twitch_id ? "default" : "no_video";
                    const fallbackSrc = await import(
                        `@/assets/img/thumbnails/default_320px/${fallbackImage}.webp`
                    );
                    return fallbackSrc.default;
                } catch (error) {
                    return null;
                }
            } else return imageSrc;
        },
        /**
         * Return the duration for a single card.
         * @param card complete card object.
         * @returns {*}
         */
        getCardDuration(card) {
            let d = Number(card.duration);
            let h = Math.floor(d / 3600);
            let m = Math.floor((d % 3600) / 60);
            let s = Math.floor((d % 3600) % 60);
            return ("0" + h).slice(-2) + ":" + ("0" + m).slice(-2) + ":" + ("0" + s).slice(-2);
        },
        /**
         * Get a collection object by id.
         * @param id id of the collection.
         * @returns {*}
         */
        getSingleCollection(id: number): Collection | null {
            return this.collections.find((item) => item.id === id) ?? null;
        },
        /**
         * Fetch json data.
         */
        fetchData() {
            this.collections = og_data.collections;
            this.content = og_data.content;
        },
        /**
         * Main filter function.
         */
        filter() {
            this.filteredData = [];

            // start with all items
            let data = this.content.slice();

            // filter content
            data = data.filter((item: Card) => filterCard(item, this.search));

            const el = document.getElementById("main-content");
            if (el) el.scrollTo({ top: 0, behavior: "smooth" });

            this.filteredData = [...data];
        },
        /**
         * Select some random items
         */
        pickRandomSet() {
            const l = this.filteredData.length <= 12 ? this.filteredData.length : 12;
            let nums = Array.from({ length: l }, () =>
                Math.floor(Math.random() * this.filteredData.length),
            );
            this.randomData = [];
            const pickedNums: number[] = [];
            nums.forEach((num) => {
                while (
                    (!this.filteredData[num].twitch_id && !this.filteredData[num].youtube_id) ||
                    pickedNums.includes(num)
                ) {
                    this.filteredData.length === num + 1 ? (num = 0) : num++;
                }
                pickedNums.push(num);
                this.randomData.push(this.filteredData[num]);
            });
        },
        /**
         * Reset all filters
         */
        resetFilters() {
            this.search = "";
            this.filters = {
                type: ["all"],
                platform: ["all"],
                free: false,
                hideSeen: false,
                vod: "all",
                date: {
                    range: "all",
                    after: "",
                    before: "",
                },
                duration: "all",
                activity: [],
                tag: [],
            };
            this.filter();
        },
        /**
         * Set filter from url query.
         * @param urlParams
         */
        setFilterFromQuery(urlParams: URLSearchParams): void {
            const type = urlParams.getAll("type");
            if (type.length) this.filters.type = type;

            const platform = urlParams.getAll("platform");
            if (platform.length) this.filters.platform = platform;

            const activity = urlParams.getAll("activity");
            if (activity.length) this.filters.activity = activity;

            const tag = urlParams.getAll("tag");
            if (tag.length) this.filters.tag = tag;

            const free = urlParams.get("free");
            if (free !== null) this.filters.free = free === "true";

            const hideSeen = urlParams.get("hide_seen");
            if (hideSeen !== null) this.filters.hideSeen = hideSeen === "true";

            const vod = urlParams.get("vod");
            if (vod !== null) this.filters.vod = vod as Vod;

            const dateRange = urlParams.get("date");
            if (dateRange !== null) this.filters.date.range = dateRange as Range;

            if (this.filters.date.range === "other") {
                const dateAfter = urlParams.get("date_after");
                if (dateAfter !== null) this.filters.date.after = dateAfter;

                const dateBefore = urlParams.get("date_before");
                if (dateBefore !== null) this.filters.date.before = dateBefore;
            }

            const duration = urlParams.get("duration");
            if (duration !== null) this.filters.duration = duration as Duration;

            this.search = urlParams.get("search") || "";

            router.replace({ query: null }).then(() => {});

            setTimeout(() => {
                toast("Filters overgenomen");
            }, 300);
        },
        /**
         * Update url query after filter change.
         */
        updateUrl() {
            const types = this.filters.type.length ? this.filters.type.map((t) => ["type", t]) : [];
            const platforms = this.filters.platform.length
                ? this.filters.platform.map((t) => ["platform", t])
                : [];
            const acts = this.filters.activity.length
                ? this.filters.activity.map((t) => ["activity", t])
                : [];
            const tags = this.filters.tag.length ? this.filters.tag.map((t) => ["tag", t]) : [];
            let search_params = new URLSearchParams(
                types.concat(acts).concat(platforms).concat(tags),
            );
            if (this.filters.free) search_params.append("free", String(this.filters.free));
            if (this.filters.hideSeen)
                search_params.append("hide_seen", String(this.filters.hideSeen));
            if (this.filters.vod) search_params.append("vod", this.filters.vod);
            if (this.filters.duration)
                search_params.append("duration", String(this.filters.duration));
            if (this.search) search_params.append("search", this.search);
            if (this.filters.date.range)
                search_params.append("date", String(this.filters.date.range));

            if (this.filters.date.range === "other") {
                if (this.filters.date.after)
                    search_params.append("date_after", this.filters.date.after);
                if (this.filters.date.before)
                    search_params.append("date_before", this.filters.date.before);
            }

            return search_params.toString();
        },
    },
});
