import {defineStore} from "pinia";
import podcasts from '../assets/podcasts.json'
import streams from '../assets/streams.json'
import videos from '../assets/videos.json'

export const useContentStore = defineStore('content', {
  state: () => ({
    baseData: [],
    filteredData: [],
    search: '',
    sortOption: ''
  }),
  getters: {
    posWords() {
      return this.search.split(' ').filter(w => !w.startsWith('-') && w.length).map(w => w.toLowerCase())
    },
    negWords() {
      return this.search.split(' ').filter(w => w.startsWith('-') && w.length).map(w => w.slice(1).toLowerCase())
    },
    sortedData() {
      //TODO wait till new json file is ready
    }
  },
  actions: {
    /**
     * Fetch json data
     */
    fetchData() {
      this.baseData = {podcasts, streams, videos}
    },
    /**
     * Main filter function
     */
    filter() {
      //TODO update filter when new json file is ready
      this.filteredData = []
      let data = {
        videos: this.baseData.videos.slice(),
        podcasts: this.baseData.podcasts.slice(),
        streams: this.baseData.streams.slice(),
      }

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

      for (const video of data.videos) {
        this.filteredData.push(video)
      }
      for (const podcast of data.podcasts) {
        this.filteredData.push(podcast)
      }
      for (const stream of data.streams) {
        this.filteredData.push(stream)
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
    }
}
})