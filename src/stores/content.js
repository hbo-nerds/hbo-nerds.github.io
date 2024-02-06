import {defineStore} from "pinia";
import og_data from '../assets/data/data.json'

export const useContentStore = defineStore('content', {
  state: () => ({
    collections: [],
    content: [],

    filteredData: [],
    randomData: [],
    search: '',
    sortOption: 'newOld',
    filters: {
      type: [],
      date: {
        range: 'all',
        after: '',
        before: ''
      },
      duration: {
        min: '',
        max: ''
      }
    }
  }),
  getters: {
    posWords() {
      return this.search.split(' ').filter(w => !w.startsWith('-') && w.length).map(w => w.toLowerCase())
    },
    negWords() {
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
        } else if(this.sortOption === 'shortLong') {
          return a.duration - b.duration
        } else if(this.sortOption === 'longShort') {
          return b.duration - a.duration
        } else return true
      })
    },
    amountOfPodcast() {
      return this.sortedData.reduce((acc, cur) => cur.type === 'podcast' ? ++acc : acc, 0);
    },
    amountOfVideo() {
      return this.sortedData.reduce((acc, cur) => cur.type === 'video' ? ++acc : acc, 0);
    },
    amountOfStream() {
      return this.sortedData.reduce((acc, cur) => cur.type === 'stream' ? ++acc : acc, 0);
    }
  },
  actions: {
    /**
     * Fetch json data
     */
    fetchData() {
      this.collections = og_data.collections
      this.content = og_data.content

    },
    /**
     * Main filter function
     */
    filter() {
      if (this.search.length < 3) return
      this.filteredData = []

      // start with all items
      let data = this.content.slice()

      // check neg words
      this.negWords.forEach((pw) => {
        data = data.filter((item) => {
          switch (item.type) {
            case 'podcast':
              return this.filterPodcast(item, pw, true)
            case 'video':
              return this.filterVideo(item, pw, true)
            case 'stream':
              return this.filterStream(item, pw, true)
          }
        })
      })

      // check pos words
      this.posWords.forEach((pw) => {
        data = data.filter((item) => {
          switch (item.type) {
            case 'podcast':
              return this.filterPodcast(item, pw)
            case 'video':
              return this.filterVideo(item, pw)
            case 'stream':
              return this.filterStream(item, pw)
          }
        })
      })

      // filter for content type
      data = data.filter(item => !this.filters.type.length || this.filters.type.includes(item.type))

      // filter for date
      data = data.filter(item => this.filters.date.range === 'all' || this.checkDate(item))

      // filter for duration
      data = data.filter(item => (!this.filters.duration.min || (this.filters.duration.min * 60) < item.duration) &&
          (!this.filters.duration.max || (this.filters.duration.max * 60) > item.duration))

      for (const item of data) {
        this.filteredData.push(item)
      }
    },
    checkDate(item) {
      let toCheck = new Date(item.date);
      if (this.filters.date.range === 'other') {
        let start = this.filters.date.after ? new Date(this.filters.date.after) : new Date('2000-01-01');
        let end = this.filters.date.before ? new Date(this.filters.date.before) : new Date('2099-01-01');
        return toCheck < end && toCheck > start
      } else {
        let d = new Date()
        d.setMonth(d.getMonth() - this.filters.date.range);
        return toCheck > d
      }

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
      return (this.normalizeInput(s['description']).includes(w) || s['titles'].some(title => {
            return this.normalizeInput(title).includes(w)
          }) ||
          (s['custom_title'] && this.normalizeInput(s['custom_title']).includes(w))
          ||
          s['activities'].some(game => {
            return this.normalizeInput(game.title).includes(w)
          }) ||
          s['tags'].some(tag => {
            return this.normalizeInput(tag).includes(w)
          })) !== negative;
    },
    /**
     * Select some random items
     */
    pickRandomSet() {
      let nums = Array.from({length: 12}, () => Math.floor(Math.random() * this.content.length));
      this.randomData = []
      nums.forEach(num => {
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
          range: 'all',
          after: '',
          before: ''
        },
        duration: {
          min: '',
          max: ''
        }
      }
      this.filter()
    }
}
})