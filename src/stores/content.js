import {defineStore} from "pinia";
import podcasts from '../assets/podcasts.json'
import streams from '../assets/streams.json'
import videos from '../assets/videos.json'
import {offset} from "@popperjs/core";

export const useContentStore = defineStore('content', {
  state: () => ({
    baseData: [],
    combinedData: [],
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
      return this.search.split(' ').filter(w => w.startsWith('-') && w.length).map(w => w.slice(1).toLowerCase())
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
      this.baseData = {podcasts, streams, videos}
      this.combinedData = [].concat(podcasts, streams, videos)
    },
    /**
     * Main filter function
     */
    filter() {
      //TODO update filter when new json file is ready
      this.filteredData = []

      // start with all items
      let data = {
        videos: this.baseData.videos.slice(),
        podcasts: this.baseData.podcasts.slice(),
        streams: this.baseData.streams.slice(),
      }

      // check neg words
      this.negWords.forEach((pw) => {
        data.videos = data.videos.filter((v) => {
          return this.filterVideo(v, pw, true)
        })
        data.podcasts = data.podcasts.filter((p) => {
          return this.filterPodcast(p, pw, true)
        })
        data.streams = data.streams.filter((s) => {
          return this.filterStream(s, pw, true)
        })
      })

      // check pos words
      this.posWords.forEach((pw) => {
        data.videos = data.videos.filter((v) => {
          return this.filterVideo(v, pw, false)
        })
        data.podcasts = data.podcasts.filter((p) => {
          return this.filterPodcast(p, pw, false)
        })
        data.streams = data.streams.filter((s) => {
          return this.filterStream(s, pw, false)
        })
      })

      // check type filter
      if (!this.filters.type.length || this.filters.type.includes('video')) {
        for (const video of data.videos) {
          this.filteredData.push(video)
        }
      }

      // check type filter
      if (!this.filters.type.length || this.filters.type.includes('podcast')) {
        for (const podcast of data.podcasts) {
          this.filteredData.push(podcast)
        }
      }

      // check type filter
      if (!this.filters.type.length || this.filters.type.includes('stream')) {
        for (const stream of data.streams) {
          this.filteredData.push(stream)
        }
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
    filterVideo(v, w, negative) {
      return (this.normalizeInput(v['title']).includes(w) || this.normalizeInput(v['description']).includes(w) ||
          (Array.isArray(v['game']) ? v['game'].some(game => {
            return this.normalizeInput(game).includes(w)
          }) : this.normalizeInput(v['game']).includes(w))) !== negative;
    },
    /**
     * Filter podcast
     * @param p podcast object
     * @param w word
     * @param negative
     * @returns {boolean}
     */
    filterPodcast(p, w, negative) {
      return (this.normalizeInput(p['title']).includes(w) || this.normalizeInput(p['description']).includes(w)) !== negative
    },
    /**
     * Filter stream
     * @param s stream object
     * @param w word
     * @param negative
     * @returns {boolean}
     */
    filterStream(s, w, negative) {
      return (this.normalizeInput(s['description']).includes(w) || s['all_titles'].some(title => {
            return this.normalizeInput(title).includes(w)
          }) ||
          s['games'].some(game => {
            return this.normalizeInput(game.title).includes(w)
          }) ||
          s['tags'].some(tag => {
            return this.normalizeInput(tag).includes(w)
          })) !== negative;
    },
    /**
     * Select 9 random items
     */
    pickRandomSet() {
      let nums = Array.from({length: 9}, () => Math.floor(Math.random() * this.combinedData.length));
      this.randomData = []
      nums.forEach(num => {
        this.randomData.push(this.combinedData[num])
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