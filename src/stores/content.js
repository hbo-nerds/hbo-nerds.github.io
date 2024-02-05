import {defineStore} from "pinia";
import og_data from '../assets/data/data.json'

export const useContentStore = defineStore('content', {
  state: () => ({
    collections: [],
    content: [],

    filteredData: [],
    randomData: [],
    search: '',
    sortOption: '',
    filters: {
      type: [],
      date: {
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
        let datePartsA = a.date.split("/");
        let datePartsB = b.date.split("/");
        let dateObjectA = new Date(+datePartsA[2], datePartsA[1] - 1, + datePartsA[0]);
        let dateObjectB = new Date(+datePartsB[2], datePartsB[1] - 1, + datePartsB[0]);

        if (!this.sortOption) return true
        else if (this.sortOption === 'oldNew') {
          return dateObjectA - dateObjectB
        } else if (this.sortOption === 'newOld') {
          return dateObjectB - dateObjectA
        } else return true
        //TODO add more sort options, wait till new json file is ready
      })
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

      data = data.filter(item => !this.filters.type.length || this.filters.type.includes(item.type))

      for (const item of data) {
        this.filteredData.push(item)
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
          after: '',
          before: ''
        },
        duration: {
          min: '',
          max: ''
        }
      }
    }
}
})