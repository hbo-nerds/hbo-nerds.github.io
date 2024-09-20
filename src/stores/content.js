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
            type: ['all'],
            platform: ['all'],
            free: false,
            vodOnly: false,
            date: {
                range: 'all',
                after: '',
                before: ''
            },
            duration: 'all',
            activity: []
        },
        selectedCardId: null
    }),
    getters: {
        /**
         * Return current selected card.
         * @returns {*|boolean}
         */
        selectedCard(state) {
            return state.selectedCardId ? this.getSingleCard(state.selectedCardId) : false
        },
        /**
         * Return title of current selected card.
         * @returns {*|string}
         */
        selectedCardTitle() {
            if (!this.selectedCard) return ''
            if (['podcast', 'video'].includes(this.selectedCard['type']))
                return this.selectedCard['title']
            else {
                if (this.selectedCard['custom_title'])
                    return this.selectedCard['custom_title']
                else if (this.selectedCard['title_main'])
                    return this.selectedCard['titles'][this.selectedCard['title_main']]
                else
                    return this.selectedCard['titles'][0]
            }
        },
        /**
         * Return list of words included in search results.
         * @returns {*}
         */
        includedWords() {
            return this.search.split(' ').filter(w => !w.startsWith('-') && w.length).map(w => w.toLowerCase())
        },
        /**
         * Return list of words excluded in search results.
         * @returns {*}
         */
        excludedWords() {
            return this.search.split(' ').filter(w => w.startsWith('-') && w.length).map(w => w.slice(1).toLowerCase()).filter(w => w)
        },
        /**
         * Order the filtered search data.
         * @returns {*}
         */
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
        /**
         * Order the series.
         * @returns {*}
         */
        sortedDataSeries(state) {
            return this.seriesFirstItems().sort((a, b) => {
                let dateA = new Date(a.date);
                let dateB = new Date(b.date);

                if (!state.sortOptionSeries) return true
                else if (state.sortOptionSeries === 'oldNew') {
                    return dateA - dateB
                } else if (state.sortOptionSeries === 'newOld') {
                    return dateB - dateA
                } else if (state.sortOptionSeries === 'shortLong') {
                    return a.duration - b.duration
                } else if (state.sortOptionSeries === 'longShort') {
                    return b.duration - a.duration
                } else return true
            })
        },
        /**
         * Group VODs by upload date.
         * @returns {*}
         */
        groupedTypes() {
            return this.content.filter(item => this.f_platform(item) && this.f_paywall(item) && this.f_vod(item) && this.f_date(item) && this.f_duration(item) && this.f_activity(item)).reduce((p, c) => {
                p[0].count++
                const type = c.type;
                const group = p.find(group => group.value === type)
                if (!group) {
                    p.push({label: type, value: type, count: 1});
                } else {
                    group.count++;
                }
                return p;
            }, [{label: 'All', value: 'all', count: 0}]);
        },
        /**
         * Group VODs by platform.
         * @returns {*}
         */
        groupedPlatforms() {
            return this.content.filter(item => this.f_type(item) && this.f_paywall(item) && this.f_vod(item) && this.f_date(item) && this.f_duration(item) && this.f_activity(item)).reduce((p, c) => {
                // Making this dynamic would require a change in the JSON to give the platform property a unique prefix/suffix.
                // Currently _id is also used by twitchtracker_id.
                // Alternatively it could be put inside a platforms array.
                // E.g. platforms: [{ name: 'twitch', id: '1234' }, { name: 'youtube', id: '5678' }]
                p[0].count++
                for (const platform of ['twitch', 'youtube']) {
                    if (!c.hasOwnProperty(platform + '_id')) continue;

                    const group = p.find(group => group.value === platform)
                    if (!group) {
                        p.push({label: platform, value: platform, count: 1});
                    } else {
                        group.count++;
                    }
                }
                return p;
            }, [{label: 'All', value: 'all', count: 0}]);
        },
        /**
         * Group VODs by upload date.
         * @returns {*}
         */
        groupedDates() {
            return this.content.filter(item => this.f_type(item) && this.f_platform(item) && this.f_paywall(item) && this.f_vod(item) && this.f_duration(item) && this.f_activity(item)).reduce((p, c) => {
                p[0].count++
                if (this.checkWithinWeeks(c, 1)) p[1].count++
                if (this.checkWithinWeeks(c, 4)) p[2].count++
                if (this.checkWithinWeeks(c, 52)) p[3].count++
                return p;
            }, [{label: 'All', value: 'all', count: 0},
                {label: 'This week', value: 1, count: 0},
                {label: 'This month', value: 4, count: 0},
                {label: 'This year', value: 52, count: 0},
            ])
        },
        /**
         * Group VODs by duration.
         * @returns {*}
         */
        groupedDuration() {
            return this.content.filter(item => this.f_type(item) && this.f_platform(item) && this.f_paywall(item) && this.f_vod(item) && this.f_date(item) && this.f_activity(item)).reduce((p, c) => {
                p[0].count++
                if (c.duration / 60 < 20) p[1].count++
                if (c.duration / 60 < 60) p[2].count++
                if (c.duration / 60 < 120) p[3].count++
                if (c.duration / 60 > 120) p[4].count++
                return p;
            }, [{label: 'All', value: 'all', count: 0},
                {label: 'Under 20 minutes', value: 20, count: 0},
                {label: 'Under 1 hour', value: 60, count: 0},
                {label: 'Under 2 hours', value: 120, count: 0},
                {label: 'Over 2 hours', value: 'over120', count: 0}
            ]);
        },
        /**
         * Group VODs by activity.
         * @returns {*}
         */
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
        /**
         * Return array containing user liked items.
         * @returns {*[]}
         */
        likedContent() {
            const s = useGeneralStore()
            let res = []
            s.likedItems.slice().reverse().forEach(id => {
                if (this.content.find(c => c.id === id))
                    res.push(this.content.find(c => c.id === id))
            })
            return res
        },
        /**
         * Return array containing user last visit items.
         * @returns {*[]}
         */
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
        getSingleCollection(collectionId, except) {
            return collectionId ? this.content.filter(item => (item.collection === parseInt(collectionId) && item.id !== except)) : []
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
         * Main filter function.
         */
        filter() {
            console.log('start filtering...')
            this.updateUrl()

            const s = useGeneralStore()
            s.pageNumber = 0

            this.filteredData = []

            // start with all items
            let data = this.content.slice()

            //TODO search based on tags in input???
            const advancedSearch = {}
            // const allowedTags = ['type', 'title', 'desc', 'game', 'tag', 'year']
            // const something = this.search.match(/([\w\d]+:[\w\d\s]+?)(?= [\w\d]+:|$)/g) || []
            // something.forEach(item => {
            //     const arr = item.split(':');
            //     let first = arr.shift();
            //     if (allowedTags.includes(first))
            //         advancedSearch[first] = arr.pop()
            // })

            if (Object.keys(advancedSearch).length) {
                data = data.filter(item => this.f_type(item, advancedSearch['type']) &&
                    this.f_title(item, advancedSearch['title']) &&
                    this.f_desc(item, advancedSearch['desc']) &&
                    this.f_activity(item, advancedSearch['game']) &&
                    this.f_tag(item, advancedSearch['tag']) &&
                    this.f_year(item, advancedSearch['year']))
            } else {
                //check neg words
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
            }


            // filter content
            data = data.filter(item => this.f_type(item) && this.f_platform(item) && this.f_paywall(item) && this.f_vod(item) && this.f_date(item) && this.f_duration(item) && this.f_activity(item))
            this.filteredData = [...data]

            console.log('done filtering.')
        },
        /**
         * Filter items by type.
         * @param item
         * @param advancedSearchType
         * @returns {boolean|*}
         */
        f_type(item, advancedSearchType = '') {
            if (this.filters.type.includes('all')) return true
            if (!this.filters.type.length && !advancedSearchType) return true
            return advancedSearchType ? item.type.toLowerCase().includes(advancedSearchType.toLowerCase()) : this.filters.type.includes(item.type)
        },
        /**
         * Filter item by title.
         * @param item
         * @param advancedSearchTitle
         * @returns {boolean|*|boolean}
         */
        f_title(item, advancedSearchTitle = '') {
            if (!advancedSearchTitle) return true
            const s = this.normalizeInput(advancedSearchTitle)
            return (this.normalizeInput(item['title']).includes(this.normalizeInput(s)) ||
                (item['titles'] ? item['titles'].some(t => this.normalizeInput(t).includes(s)) : false) ||
                this.normalizeInput(item['custom_title']).includes(s))
        },
        f_desc(item, advancedSearchDesc = '') {
            if (!advancedSearchDesc) return true
            const s = this.normalizeInput(advancedSearchDesc)
            return this.normalizeInput(item['description']).includes(s)
        },
        /**
         * Filter items by platform.
         * @param item
         * @returns {boolean|*}
         */
        f_platform(item) {
            if (this.filters.platform.includes('all')) return true
            if (!this.filters.type.length) return true
            return this.filters.platform.some(platform => item[platform + "_id"]);
        },
        /**
         * Filter item by paywall.
         * @param item
         * @returns {boolean}
         */
        f_paywall(item) {
            if (!this.filters.free) return true
            return item.type !== 'stream' || item.free
        },
        /**
         * Filter item by VOD availability.
         */
        f_vod(item) {
            if (!this.filters.vodOnly) return true
            return item['twitch_id'] || item['youtube_id']
        },
        /**
         * Filter items by date.
         * @param item
         * @returns {boolean}
         */
        f_date(item) {
            if (this.filters.date.range === 'all') return true
            let toCheck = new Date(item.date);
            if (this.filters.date.range === 'other') {
                let start = this.filters.date.after ? new Date(this.filters.date.after) : new Date('2000-01-01');
                let end = this.filters.date.before ? new Date(this.filters.date.before) : new Date('2099-01-01');
                return toCheck < end && toCheck > start
            } else {
                return this.checkWithinWeeks(item, this.filters.date.range)
            }
        },
        /**
         * Filter item by upload year.
         * @param item
         * @param year
         * @returns {boolean}
         */
        f_year(item, year) {
            if (!year) return true
            const yearToCheck = new Date(item.date).getFullYear()
            return yearToCheck === Number(year)
        },
        /**
         * Filter items by duration.
         * @param item
         * @returns {boolean}
         */
        f_duration(item) {
            if (this.filters.duration === 'all') return true
            if (this.filters.duration === 'over120') return (item.duration / 60) > 120
            return ((item.duration / 60) < this.filters.duration)
        },
        /**
         * Filter items by activity.
         * @param item
         * @param advancedSearch
         * @returns {*|boolean}
         */
        f_activity(item, advancedSearch = '') {
            if (!this.filters.activity.length && !advancedSearch) return true
            const s = this.normalizeInput(advancedSearch)
            const act = item['activity'] || item['activities'];
            if (!act) return false
            if (Array.isArray(act)) {
                if (typeof act[0] === 'string')
                    return advancedSearch ? act.some(a => this.normalizeInput(a).includes(s)) :
                        this.filters.activity.some(r => act.includes(r))
                else {
                    return advancedSearch ? act.map(x => x.title).some(a => this.normalizeInput(a).includes(s)) :
                        this.filters.activity.some((r) => {
                            return act.map(x => this.normalizeInput(x.title)).includes(this.normalizeInput(r))
                        })
                }
            } else
                return advancedSearch ? this.normalizeInput(act).includes(s) : this.filters.activity.includes(act)
        },
        f_tag(item, advancedSearchTag = '') {
            if (!advancedSearchTag) return true
            const s = this.normalizeInput(advancedSearchTag)
            return item['tags'] ? item['tags'].some(tag => this.normalizeInput(tag).includes(s)) : false
        },
        /**
         * Check if item's date is in range.
         * @param item
         * @param wks
         * @returns {boolean}
         */
        checkWithinWeeks(item, wks) {
            let toCheck = new Date(item.date);
            let d = new Date()
            d.setDate(d.getDate() - (7 * wks))
            return toCheck > d
        },
        /**
         * Check if item's date is in range
         * @param item
         * @param mth
         * @returns {boolean}
         */
        checkWithinMonths(item, mth) {
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
         * Filter video on title & description & activity
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
         * Filter podcast on title & description
         * @param p podcast object
         * @param w word
         * @param negative
         * @returns {boolean}
         */
        filterPodcast(p, w, negative = false) {
            return (this.normalizeInput(p['title']).includes(w) || this.normalizeInput(p['description']).includes(w)) !== negative
        },
        /**
         * Filter stream on title & custom_title & description & activities & tags
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
            const l = this.filteredData.length <= 12 ? this.filteredData.length : 12
            let nums = Array.from({length: l}, () => Math.floor(Math.random() * this.filteredData.length));
            this.randomData = []
            const pickedNums = [];
            nums.forEach(num => {
                while ((!this.filteredData[num]['twitch_id'] && !this.filteredData[num]['youtube_id']) || pickedNums.includes(num)) {
                    this.filteredData.length === num + 1 ? num = 0 : num++
                }
                pickedNums.push(num)
                this.randomData.push(this.filteredData[num])
            })
        },
        /**
         * Reset all filters
         */
        resetFilters() {
            this.filters = {
                type: ['all'],
                platform: ['all'],
                free: false,
                vodOnly: false,
                date: {
                    range: 'alle',
                    after: '',
                    before: ''
                },
                duration: 'all',
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
        /**
         * Set filter from url query.
         * @param urlParams
         */
        setFilterFromQuery(urlParams) {
            if (urlParams.getAll('type')) this.filters.type = urlParams.getAll('type')
            if (urlParams.getAll('platform')) this.filters.platform = urlParams.getAll('platform')
            if (urlParams.getAll('activity')) this.filters.activity = urlParams.getAll('activity')
            if (urlParams.get('free')) this.filters.free = urlParams.get('free')
            if (urlParams.get('vodOnly')) this.filters.vodOnly = urlParams.get('vodOnly')
            if (urlParams.get('date_weeks')) this.filters.date.range = parseInt(urlParams.get('date_weeks'))
            if (urlParams.get('duration')) this.filters.duration = urlParams.get('duration')
            this.search = urlParams.get('search') || ''
        },
        /**
         * Update url query after filter change.
         */
        updateUrl() {
            const types = this.filters.type.length ? this.filters.type.map(t => ['type', t]) : []
            const platforms = this.filters.platform.length ? this.filters.platform.map(t => ['platform', t]) : []
            const acts = this.filters.activity.length ? this.filters.activity.map(t => ['activity', t]) : []
            let search_params = new URLSearchParams(types.concat(acts).concat(platforms))
            if (this.filters.free)
                search_params.append('free', this.filters.free)
            if (this.filters.vodOnly)
                search_params.append('vodOnly', this.filters.vodOnly)
            if (this.filters.date.range !== 'all')
                search_params.append('date_weeks', this.filters.date.range)
            if (this.filters.duration !== 'all')
                search_params.append('duration', this.filters.duration)
            if (this.search)
                search_params.append('search', this.search)

            let url_search = search_params.toString()
            if (url_search) {
                router.replace({query: {filter: url_search}}).then(r => {
                })
            } else {
                router.replace({query: null}).then(r => {
                })
            }
        }
    }
})