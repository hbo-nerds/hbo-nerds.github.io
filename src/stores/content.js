import {defineStore} from "pinia";
import og_data from '../assets/data/data.json'
import {filename} from "pathe/utils";
import {useGeneralStore} from "./general.js";

export const useContentStore = defineStore('content', {
    state: () => ({
        collections: [],
        content: [],
        images: {
            '320': [],
            '640': []
        },

        filteredData: [],
        randomData: [],
        search: '',
        sortOption: 'newOld',
        filters: {
            type: [],
            date: {
                range: 'alle',
                after: '',
                before: ''
            },
            duration: {
                min: '',
                max: ''
            },
            activity: []
        },
    }),
    getters: {
        includedWords() {
            return this.search.split(' ').filter(w => !w.startsWith('-') && w.length).map(w => w.toLowerCase())
        },
        excludedWords() {
            return this.search.split(' ').filter(w => w.startsWith('-') && w.length).map(w => w.slice(1).toLowerCase()).filter(w => w)
        },
        sortedData() {
            return this.filteredData.sort((a, b) => {
                let dateA = new Date(a.date);
                let dateB = new Date(b.date);

                if (!this.sortOption) return true
                else if (this.sortOption === 'oldNew') {
                    return dateA - dateB
                } else if (this.sortOption === 'newOld') {
                    return dateB - dateA
                } else if (this.sortOption === 'shortLong') {
                    return a.duration - b.duration
                } else if (this.sortOption === 'longShort') {
                    return b.duration - a.duration
                } else return true
            })
        },
        groupedTypes() {
            return this.content.filter(item => this.f_date(item) && this.f_duration(item) && this.f_activity(item)).reduce((p, c) => {
                const type = c.type;
                if (!p.hasOwnProperty(type)) {
                    p[type] = 0;
                }
                p[type]++;
                return p;
            }, {});
        },
        groupedDates() {
            return this.content.filter(item => this.f_type(item) && this.f_duration(item) && this.f_activity(item)).reduce((p, c) => {
                p['alle']++
                if (this.checkSingleDate(c, 3)) p['< 3 maanden']++
                if (this.checkSingleDate(c, 6)) p['< 6 maanden']++
                if (this.checkSingleDate(c, 12)) p['< 12 maanden']++
                return p;
            }, { 'alle': 0,'< 3 maanden': 0, '< 6 maanden': 0, '< 12 maanden': 0});
        },
        groupedActivities() {
            return this.content.filter(item => this.f_type(item) && this.f_date(item) && this.f_duration(item)).reduce((p, c) => {
                const act = c['activity'] || c['activities'];
                if (act === undefined) return p
                if (Array.isArray(act)) {
                    act.forEach((a) => {
                        if (typeof a === 'string') {
                            if (!p.hasOwnProperty(a))
                                p[a] = 0;
                            p[a]++;
                        } else {
                            if (!p.hasOwnProperty(a.title))
                                p[a.title] = 0;
                            p[a.title]++;
                        }
                    })
                    return p
                } else {
                    if (!p.hasOwnProperty(act))
                        p[act] = 0;
                    p[act]++;
                    return p;
                }
            }, {});
        }
    },
    actions: {
        getSingleCard(id) {
            return this.content.find(item => item.id === id)
        },
        getSingleCollection(card) {
            return card.collection ? this.content.filter(item => item.collection === card.collection) : []
        },
        getCollectionName(collectionId) {
            return this.collections.find(item => item.id === collectionId).title
        },
        /**
         * Fetch json data
         */
        fetchData() {
            this.collections = og_data.collections
            this.content = og_data.content
        },
        /**
         * Set images file names
         */
        setImages() {
            let glob = import.meta.glob('@/assets/img/thumbnails/*320px/*.webp', {eager: true})
            this.images['320'] = Object.fromEntries(
                Object.entries(glob).map(([key, value]) => [filename(key), value.default])
            )
            glob = import.meta.glob('@/assets/img/thumbnails/*640px/*.webp', {eager: true})
            this.images['640'] = Object.fromEntries(
                Object.entries(glob).map(([key, value]) => [filename(key), value.default])
            )
        },
        /**
         * Main filter function
         */
        filter() {
            const s = useGeneralStore()
            s.pageNumber = 0

            this.filteredData = []

            // start with all items
            let data = this.content.slice()

            // check neg words
            this.excludedWords.forEach((nw) => {
                const nw_normalized = this.normalizeInput(nw)
                data = data.filter((item) => {
                    switch (item.type) {
                        case 'podcast':
                            return this.filterPodcast(item, nw_normalized, true)
                        case 'video':
                            return this.filterVideo(item, nw_normalized, true)
                        case 'stream':
                            return this.filterStream(item, nw_normalized, true)
                    }
                })
            })

            // check pos words
            this.includedWords.forEach((pw) => {
                const pw_normalized = this.normalizeInput(pw)
                data = data.filter((item) => {
                    switch (item.type) {
                        case 'podcast':
                            return this.filterPodcast(item, pw_normalized)
                        case 'video':
                            return this.filterVideo(item, pw_normalized)
                        case 'stream':
                            return this.filterStream(item, pw_normalized)
                    }
                })
            })

            // filter content
            data = data.filter(item => this.f_type(item) && this.f_date(item) && this.f_duration(item) && this.f_activity(item))

            for (const item of data) {
                this.filteredData.push(item)
            }
        },
        f_type(item) {
            return !this.filters.type.length || this.filters.type.includes(item.type)
        },
        f_date(item) {
            if (this.filters.date.range === 'alle') return true
            let toCheck = new Date(item.date);
            if (this.filters.date.range === 'other') {
                let start = this.filters.date.after ? new Date(this.filters.date.after) : new Date('2000-01-01');
                let end = this.filters.date.before ? new Date(this.filters.date.before) : new Date('2099-01-01');
                return toCheck < end && toCheck > start
            } else {
                let d = new Date()
                const range = this.filters.date.range.match(/\d+/)[0]
                d.setMonth(d.getMonth() - range);
                return toCheck > d
            }
        },
        f_duration(item) {
            return (!this.filters.duration.min || (this.filters.duration.min * 60) < item.duration) &&
            (!this.filters.duration.max || (this.filters.duration.max * 60) > item.duration)
        },
        f_activity(item) {
            if (!this.filters.activity.length) return true
            const act = item['activity'] || item['activities'];
            if (Array.isArray(act)) {
                if (typeof act[0] === 'string')
                    return this.filters.activity.some(r=> act.includes(r))
                else
                    return this.filters.activity.some(r=> act.map(x => x.title).includes(r))
            } else
                return this.filters.activity.includes(act)
        },
        checkSingleDate(item, mth) {
            let toCheck = new Date(item.date);
            let d = new Date()
            d.setMonth(d.getMonth() - mth);
            return toCheck > d
        },
        /**
         * Normalize the input
         * @param input
         * @returns {string|string}
         */
        normalizeInput(input) {
            return !input ? '' : input.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "")
        },
        /**
         * Filter video
         * @param v video object
         * @param w word
         * @param negative
         * @returns {boolean}
         */
        filterVideo(v, w, negative = false) {
            return (this.normalizeInput(v['title']).includes(w) || this.normalizeInput(v['description']).includes(w) ||
                (Array.isArray(v['activity']) ? v['activity'].some(act => {
                    return this.normalizeInput(act).includes(w)
                }) : this.normalizeInput(v['activity']).includes(w))) !== negative;
        },
        /**
         * Filter podcast
         * @param p podcast object
         * @param w word
         * @param negative
         * @returns {boolean}
         */
        filterPodcast(p, w, negative = false) {
            return (this.normalizeInput(p['title']).includes(w) || this.normalizeInput(p['description']).includes(w)) !== negative
        },
        /**
         * Filter stream
         * @param s stream object
         * @param w word
         * @param negative
         * @returns {boolean}
         */
        filterStream(s, w, negative = false) {
            return (this.normalizeInput(s['description']).includes(w) ||
                ((s['titles'] ? s['titles'].some(title => {
                    return this.normalizeInput(title).includes(w)
                }) : false))
                ||
                (s['custom_title'] && this.normalizeInput(s['custom_title']).includes(w))
                ||
                (s['activities'] ? s['activities'].some(game => {
                    return this.normalizeInput(game.title).includes(w)
                }) : false)
                ||
                (s['tags'] ? s['tags'].some(tag => {
                    return this.normalizeInput(tag).includes(w)
                }) : false)) !== negative;
        },
        /**
         * Select some random items
         */
        pickRandomSet() {
            let nums = Array.from({length: 12}, () => Math.floor(Math.random() * this.content.length));
            this.randomData = []
            nums.forEach(num => {
                while (!this.content[num]['twitch_id'] && !this.content[num]['youtube_id']) {
                    this.content.length === num + 1 ? num = 0 : num++
                }
                this.randomData.push(this.content[num])
            })
        },
        /**
         * Reset all filters
         */
        resetFilters() {
            this.filters = {
                type: [],
                date: {
                    range: 'alle',
                    after: '',
                    before: ''
                },
                duration: {
                    min: '',
                    max: ''
                },
                activity: []
            }
            this.filter()
        }
    }
})