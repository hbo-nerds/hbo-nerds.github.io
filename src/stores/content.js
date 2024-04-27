import {defineStore} from "pinia";
import og_data from '../assets/data/data.json'
import {filename} from "pathe/utils";
import {useGeneralStore} from "./general.js";
import router from "@/router/index.js";

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
        sortOptionSeries: 'newOld',
        filters: {
            type: [],
            platform: [],
            free: false,
            vodOnly: false,
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
        sortedDataSeries() {
            return this.seriesFirstItems().sort((a, b) => {
                let dateA = new Date(a.date);
                let dateB = new Date(b.date);

                if (!this.sortOptionSeries) return true
                else if (this.sortOptionSeries === 'oldNew') {
                    return dateA - dateB
                } else if (this.sortOptionSeries === 'newOld') {
                    return dateB - dateA
                } else if (this.sortOptionSeries === 'shortLong') {
                    return a.duration - b.duration
                } else if (this.sortOptionSeries === 'longShort') {
                    return b.duration - a.duration
                } else return true
            })
        },
        groupedTypes() {
            return this.content.filter(item => this.f_platform(item) && this.f_paywall(item) && this.f_vod(item) && this.f_date(item) && this.f_duration(item) && this.f_activity(item)).reduce((p, c) => {
                const type = c.type;
                if (!p.hasOwnProperty(type)) {
                    p[type] = 0;
                }
                p[type]++;
                return p;
            }, {});
        },
        groupedPlatforms() {
            return this.content.filter(item => this.f_type(item) && this.f_paywall(item) && this.f_vod(item) && this.f_date(item) && this.f_duration(item) && this.f_activity(item)).reduce((p, c) => {
                // Making this dynamic would require a change in the JSON to give the platform property a unique prefix/suffix.
                // Currently _id is also used by twitchtracker_id.
                // Alternatively it could be put inside a platforms array.
                // E.g. platforms: [{ name: 'twitch', id: '1234' }, { name: 'youtube', id: '5678' }]
                for (const platform of ['twitch', 'youtube']) {
                    if (!c.hasOwnProperty(platform + '_id')) continue
                    if (!p.hasOwnProperty(platform)) {
                        p[platform] = 0;
                    }
                    p[platform]++;
                }
                return p;
            }, {});
        },
        groupedDates() {
            return this.content.filter(item => this.f_type(item) && this.f_platform(item) && this.f_paywall(item) && this.f_vod(item) && this.f_duration(item) && this.f_activity(item)).reduce((p, c) => {
                p['alle']++
                if (this.checkSingleDate(c, 3)) p['< 3 maanden']++
                if (this.checkSingleDate(c, 6)) p['< 6 maanden']++
                if (this.checkSingleDate(c, 12)) p['< 12 maanden']++
                return p;
            }, { 'alle': 0,'< 3 maanden': 0, '< 6 maanden': 0, '< 12 maanden': 0});
        },
        groupedActivities() {
            return this.content.filter(item => this.f_type(item) && this.f_platform(item) && this.f_paywall(item) && this.f_vod(item) && this.f_date(item) && this.f_duration(item)).reduce((p, c) => {
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
        },
        likedContent() {
            const s = useGeneralStore()
            let res = []
            s.likedItems.slice().reverse().forEach(id => {
                if (this.content.find(c => c.id === id))
                    res.push(this.content.find(c => c.id === id))
            })
            return res
        },
        historyContent() {
            const s = useGeneralStore()
            let res = []
            s.history.forEach(id => {
                if (this.content.find(c => c.id === id))
                    res.push(this.content.find(c => c.id === id))
            })
            return res
        }
    },
    actions: {
        /**
         * Return a single item by id
         * @param id
         * @returns {*}
         */
        getSingleCard(id) {
            return this.content.find(item => item.id === id)
        },
        /**
         * Return a list of items within collection
         * @param collectionId id of the collection
         * @returns {*|*[]}
         */
        getSingleCollection(collectionId) {
            return collectionId ? this.content.filter(item => item.collection === parseInt(collectionId)) : []
        },
        /**
         * Return the collection by id
         * @param collectionId
         * @returns {*}
         */
        getCollection(collectionId) {
            return this.collections.find(item => item.id === parseInt(collectionId))
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
            this.updateUrl()

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
            data = data.filter(item => this.f_type(item) && this.f_platform(item) && this.f_paywall(item) && this.f_vod(item) && this.f_date(item) && this.f_duration(item) && this.f_activity(item))

            for (const item of data) {
                this.filteredData.push(item)
            }
        },
        /**
         * Filter items by type
         * @param item
         * @returns {boolean|*}
         */
        f_type(item) {
            return !this.filters.type.length || this.filters.type.includes(item.type)
        },
        /**
         * Filter items by platform
         * @param item
         * @returns {boolean|*}
         */
        f_platform(item) {
            return !this.filters.platform.length || this.filters.platform.some(platform => item[platform + "_id"]);
        },
        /**
         * Filter item by paywall
         * @param item
         * @returns {boolean}
         */
        f_paywall(item) {
            if (!this.filters.free) return true
            return item.type !== 'stream' || item.free
        },
        /**
         * Filter item by VOD availability
         */
        f_vod(item) {
            if (!this.filters.vodOnly) return true
            return item['twitch_id'] || item['youtube_id']
        },
        /**
         * Filter items by date
         * @param item
         * @returns {boolean}
         */
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
        /**
         * Filter items by duration
         * @param item
         * @returns {boolean}
         */
        f_duration(item) {
            return (!this.filters.duration.min || (this.filters.duration.min * 60) < item.duration) &&
            (!this.filters.duration.max || (this.filters.duration.max * 60) > item.duration)
        },
        /**
         * Filter items by activity
         * @param item
         * @returns {*|boolean}
         */
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
        /**
         * Check if item's date is in range
         * @param item
         * @param mth
         * @returns {boolean}
         */
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
            let nums = Array.from({length: 12}, () => Math.floor(Math.random() * this.filteredData.length));
            this.randomData = []
            nums.forEach(num => {
                while (!this.filteredData[num]['twitch_id'] && !this.filteredData[num]['youtube_id']) {
                    this.filteredData.length === num + 1 ? num = 0 : num++
                }
                this.randomData.push(this.filteredData[num])
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
        },
        /**
         * Return amount of items in collection
         * @param collectionId
         * @returns {*}
         */
        countSeriesItems(collectionId) {
            return this.content.filter(i => i.collection === collectionId).length
        },
        /**
         * Return array with collection first items
         * @returns {*[]}
         */
        seriesFirstItems() {
            return this.collections.map(col => {
                return this.content.find(item => item.collection === col.id)
            }).filter(item => item)
        },
        setFilterFromQuery(urlParams) {
            if(urlParams.getAll('type')) this.filters.type = urlParams.getAll('type')
            if(urlParams.getAll('platform')) this.filters.platform = urlParams.getAll('platform')
            if(urlParams.get('free')) this.filters.free = urlParams.get('free')
            if(urlParams.get('vodOnly')) this.filters.vodOnly = urlParams.get('vodOnly')
            if(urlParams.get('date_range')) this.filters.date.range = urlParams.get('date_range')
            if(urlParams.get('date_after')) this.filters.date.after = urlParams.get('date_after')
            if(urlParams.get('date_before')) this.filters.date.before = urlParams.get('date_before')
            if(urlParams.get('duration_min')) this.filters.duration.min = urlParams.get('duration_min')
            if(urlParams.get('duration_max')) this.filters.duration.max = urlParams.get('duration_max')
            if(urlParams.getAll('activity')) this.filters.activity = urlParams.getAll('activity')
        },
        updateUrl() {
            const types = this.filters.type.length ? this.filters.type.map(t => ['type', t]) : []
            const platforms = this.filters.platform.length ? this.filters.platform.map(t => ['platform', t]) : []
            const acts = this.filters.activity.length ? this.filters.activity.map(t => ['activity', t]) : []
            let search = new URLSearchParams(types.concat(acts).concat(platforms))
            if (this.filters.free)
                search.append('free', this.filters.free)
            if (this.filters.vodOnly)
                search.append('vodOnly', this.filters.vodOnly)
            if (this.filters.date.range !== 'alle')
                search.append('date_range', this.filters.date.range)
            if (this.filters.date.after)
                search.append('date_after', this.filters.date.after)
            if (this.filters.date.before)
                search.append('date_before', this.filters.date.before)
            if (this.filters.duration.min)
                search.append('duration_min', this.filters.duration.min)
            if (this.filters.duration.max)
                search.append('duration_max', this.filters.duration.max)
            router.replace({query: { filter: search.toString() }}).then(r => {})
        }
    }
})