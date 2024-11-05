import router from "@/router/index.js";
import { filename } from "pathe/utils";
import { defineStore } from "pinia";
import { toast } from "vue3-toastify";
import og_data from "../assets/data/data.json";
import { useGeneralStore } from "./general.js";

export const useContentStore = defineStore("content", {
  state: () => ({
    collections: [],
    content: [],
    images: {
      320: [],
      640: [],
    },

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
     * Return current selected card.
     * @returns {*|boolean}
     */
    selectedCard(state) {
      return state.selectedCardId ? state.getSingleCard(state.selectedCardId) : false;
    },
    /**
     * Return list of words included in search results.
     * @returns {*}
     */
    includedWords() {
      return this.search
        .split(" ")
        .filter((w) => !w.startsWith("-") && w.length)
        .map((w) => w.toLowerCase());
    },
    /**
     * Return list of words excluded in search results.
     * @returns {*}
     */
    excludedWords() {
      return this.search
        .split(" ")
        .filter((w) => w.startsWith("-") && w.length)
        .map((w) => w.slice(1).toLowerCase())
        .filter((w) => w);
    },
    /**
     * Sort the filtered search data.
     * @returns {*}
     */
    sortedData(state) {
      return state.filteredData.sort((a, b) => {
        let dateA = new Date(a.date);
        let dateB = new Date(b.date);

        if (!state.sortOption) return true;
        else if (state.sortOption === "oldNew") {
          return dateA - dateB;
        } else if (state.sortOption === "newOld") {
          return dateB - dateA;
        } else if (state.sortOption === "shortLong") {
          return a.duration - b.duration;
        } else if (state.sortOption === "longShort") {
          return b.duration - a.duration;
        } else return true;
      });
    },
    /**
     * Return all collections (items included).
     * @returns {*}
     */
    getCompleteCollections(state) {
      return state.collections.map((col) => {
        const id = col.id;
        col.items = this.content.filter((item) => {
          if (Array.isArray(item["collection"])) return item["collection"].includes(id);
          else return item["collection"] === id;
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
    groupedTypes(state) {
      return this.content
        .filter(
          (item) =>
            state.f_search(item) &&
            state.f_platform(item) &&
            state.f_paywall(item) &&
            state.f_seen(item) &&
            state.f_vod(item) &&
            state.f_date(item) &&
            state.f_duration(item) &&
            state.f_activity(item) &&
            state.f_tag(item),
        )
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
    groupedPlatforms(state) {
      return this.content
        .filter(
          (item) =>
            state.f_search(item) &&
            state.f_type(item) &&
            state.f_paywall(item) &&
            state.f_seen(item) &&
            state.f_vod(item) &&
            state.f_date(item) &&
            state.f_duration(item) &&
            state.f_activity(item) &&
            state.f_tag(item),
        )
        .reduce(
          (p, c) => {
            // Making this dynamic would require a change in the JSON to give the platform property a unique prefix/suffix.
            // Currently _id is also used by twitchtracker_id.
            // Alternatively it could be put inside a platforms array.
            // E.g. platforms: [{ name: 'twitch', id: '1234' }, { name: 'youtube', id: '5678' }]
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
    groupedDates(state) {
      return this.content
        .filter(
          (item) =>
            state.f_search(item) &&
            state.f_type(item) &&
            state.f_platform(item) &&
            state.f_paywall(item) &&
            state.f_seen(item) &&
            state.f_vod(item) &&
            state.f_duration(item) &&
            state.f_activity(item) &&
            state.f_tag(item),
        )
        .reduce(
          (p, c) => {
            p[0].count++;
            if (state.checkWithinWeeks(c, 1)) p[1].count++;
            if (state.checkWithinWeeks(c, 4)) p[2].count++;
            if (state.checkWithinWeeks(c, 52)) p[3].count++;
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
    groupedDuration(state) {
      return this.content
        .filter(
          (item) =>
            state.f_search(item) &&
            state.f_type(item) &&
            state.f_platform(item) &&
            state.f_paywall(item) &&
            state.f_seen(item) &&
            state.f_vod(item) &&
            state.f_date(item) &&
            state.f_activity(item) &&
            state.f_tag(item),
        )
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
    groupedActivities(state) {
      return this.content
        .filter(
          (item) =>
            state.f_search(item) &&
            state.f_type(item) &&
            state.f_platform(item) &&
            state.f_paywall(item) &&
            state.f_seen(item) &&
            state.f_vod(item) &&
            state.f_date(item) &&
            state.f_duration(item) &&
            state.f_tag(item),
        )
        .reduce((p, c) => {
          const act = c["activity"] || c["activities"];
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
    groupedTags(state) {
      return this.content
        .filter(
          (item) =>
            state.f_search(item) &&
            state.f_type(item) &&
            state.f_platform(item) &&
            state.f_paywall(item) &&
            state.f_seen(item) &&
            state.f_vod(item) &&
            state.f_date(item) &&
            state.f_duration(item) &&
            state.f_activity(item),
        )
        .reduce((p, c) => {
          const tags = c["tags"];
          if (tags === undefined) return p;
          if (Array.isArray(tags)) {
            tags.forEach((tag) => {
              if (!p.hasOwnProperty(tag)) p[tag] = 0;
              p[tag]++;
            });
            return p;
          } else {
            if (!p.hasOwnProperty(tags)) p[tags] = 0;
            p[tags]++;
            return p;
          }
        }, {});
    },
    /**
     * Return array containing user liked items.
     * @returns {*[]}
     */
    likedContent() {
      const s = useGeneralStore();
      let res = [];
      s.likedItems
        .slice()
        .reverse()
        .forEach((id) => {
          if (this.content.find((c) => c.id === id))
            res.push(this.content.find((c) => c.id === id));
        });
      return res;
    },
    /**
     * Return array containing user last visit items.
     * @returns {*[]}
     */
    historyContent() {
      const s = useGeneralStore();
      let res = [];
      s.history.forEach((id) => {
        if (this.content.find((c) => c.id === id)) res.push(this.content.find((c) => c.id === id));
      });
      return res;
    },
    /**
     * Get data for heatmap.
     * @returns {*}
     */
    groupedYearDate() {
      return this.sortedData.reduce((p, c) => {
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
      }, {});
    },
  },
  actions: {
    /**
     * Return a single item by id.
     * @param id id of single item.
     * @returns {*}
     */
    getSingleCard(id) {
      return this.content.find((item) => item.id === id);
    },
    /**
     * Return the title for a single card.
     * @param card complete card object.
     * @returns {*}
     */
    getCardTitle(card) {
      if (["podcast", "video"].includes(card["type"])) return card["title"];
      else {
        if (card["custom_title"]) return card["custom_title"];
        else if (card["title_main"]) return card["titles"][card["title_main"]];
        else return card["titles"][0];
      }
    },
    /**
     * Return the thumbnail for a single card.
     * @param card complete card object.
     * @returns {*}
     */
    getCardThumbnail(card) {
      return (
        this.images["640"][`${card["twitch_id"]}`] ||
        this.images["640"][`${card["youtube_id"]}`] ||
        (!card["twitch_id"] && !card["youtube_id"]
          ? this.images["640"][`no_video`]
          : this.images["640"][`default`])
      );
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
     * Get collection object by id.
     * @param id id of the collection.
     * @returns {*}
     */
    getSingleCollection(id) {
      return this.collections.find((item) => item.id === id);
    },
    /**
     * Fetch json data.
     */
    fetchData() {
      this.collections = og_data.collections;
      this.content = og_data.content;
    },
    /**
     * Set images file names.
     */
    setImages() {
      let lowResImages = import.meta.glob("@/assets/img/thumbnails/*320px/*.webp", { eager: true });
      let highResImages = import.meta.glob("@/assets/img/thumbnails/*640px/*.webp", {
        eager: true,
      });

      this.images["320"] = Object.fromEntries(
        Object.entries(lowResImages).map(([key, value]) => [filename(key), value.default]),
      );
      this.images["640"] = Object.fromEntries(
        Object.entries(highResImages).map(([key, value]) => [filename(key), value.default]),
      );
    },
    /**
     * Main filter function.
     */
    filter() {
      this.filteredData = [];

      // start with all items
      let data = this.content.slice();

      // filter content
      data = data.filter(
        (item) =>
          this.f_search(item) &&
          this.f_type(item) &&
          this.f_platform(item) &&
          this.f_paywall(item) &&
          this.f_seen(item) &&
          this.f_vod(item) &&
          this.f_date(item) &&
          this.f_duration(item) &&
          this.f_activity(item) &&
          this.f_tag(item),
      );

      const el = document.getElementById("main-content");
      if (el) el.scrollTo({ top: 0, behavior: "smooth" });

      this.filteredData = [...data];
    },
    /**
     * Filter on search input.
     * @param item
     * @returns {boolean}
     */
    f_search(item) {
      //check negative words
      for (let i = 0; i < this.excludedWords.length; i++) {
        const word = this.normalizeInput(this.excludedWords[i]);
        if (!this.checkWord(item, word, true)) return false;
      }

      //check positive words
      for (let i = 0; i < this.includedWords.length; i++) {
        const word = this.normalizeInput(this.includedWords[i]);
        if (!this.checkWord(item, word, false)) return false;
      }

      return true;
    },
    /**
     * Filter items by type.
     * @param item
     * @param advancedSearchType
     * @returns {boolean|*}
     */
    f_type(item, advancedSearchType = "") {
      if (this.filters.type.includes("all")) return true;
      if (!this.filters.type.length && !advancedSearchType) return true;
      return advancedSearchType
        ? item.type.toLowerCase().includes(advancedSearchType.toLowerCase())
        : this.filters.type.includes(item.type);
    },
    /**
     * Filter items by platform.
     * @param item
     * @returns {boolean|*}
     */
    f_platform(item) {
      if (this.filters.platform.includes("all")) return true;
      if (!this.filters.type.length) return true;
      return this.filters.platform.some((platform) => item[platform + "_id"]);
    },
    /**
     * Filter item by paywall.
     * @param item
     * @returns {boolean}
     */
    f_paywall(item) {
      if (!this.filters.free) return true;
      return item.type !== "stream" || item.free;
    },
    /**
     * Filter item by suser seen.
     * @param item
     * @returns {boolean}
     */
    f_seen(item) {
      if (!this.filters.hideSeen) return true;
      const s = useGeneralStore();
      return !s.seenItems.includes(item.id);
    },
    /**
     * Filter item by VOD availability.
     */
    f_vod(item) {
      if (this.filters.vod === "all") return true;
      else if (this.filters.vod === "vod_only") return item["twitch_id"] || item["youtube_id"];
      else if (this.filters.vod === "no_vod_only") return !item["twitch_id"] && !item["youtube_id"];
    },
    /**
     * Filter items by date.
     * @param item
     * @returns {boolean}
     */
    f_date(item) {
      if (this.filters.date.range === "all") return true;
      let toCheck = new Date(item.date);
      if (this.filters.date.range === "other") {
        let start = this.filters.date.after
          ? new Date(this.filters.date.after)
          : new Date("2000-01-01");
        let end = this.filters.date.before
          ? new Date(this.filters.date.before)
          : new Date("2099-01-01");
        return toCheck < end && toCheck >= start;
      } else {
        return this.checkWithinWeeks(item, this.filters.date.range);
      }
    },
    /**
     * Filter items by duration.
     * @param item
     * @returns {boolean}
     */
    f_duration(item) {
      if (this.filters.duration === "all") return true;
      if (this.filters.duration === "over120") return item.duration / 60 > 120;
      return item.duration / 60 < this.filters.duration;
    },
    /**
     * Filter items by activity.
     * @param item
     * @param advancedSearch
     * @returns {*|boolean}
     */
    f_activity(item, advancedSearch = "") {
      if (!this.filters.activity.length && !advancedSearch) return true;
      const s = this.normalizeInput(advancedSearch);
      const act = item["activity"] || item["activities"];
      if (!act) return false;
      if (Array.isArray(act)) {
        if (typeof act[0] === "string")
          return advancedSearch
            ? act.some((a) => this.normalizeInput(a).includes(s))
            : this.filters.activity.some((r) => act.includes(r));
        else {
          return advancedSearch
            ? act.map((x) => x.title).some((a) => this.normalizeInput(a).includes(s))
            : this.filters.activity.some((r) => {
                return act
                  .map((x) => this.normalizeInput(x.title))
                  .includes(this.normalizeInput(r));
              });
        }
      } else
        return advancedSearch
          ? this.normalizeInput(act).includes(s)
          : this.filters.activity.includes(act);
    },
    /**
     * Filter items by tag.
     * @param item
     * @param advancedSearch
     * @returns {*|boolean}
     */
    f_tag(item, advancedSearch = "") {
      if (!this.filters.tag.length && !advancedSearch) return true;
      const s = this.normalizeInput(advancedSearch);
      const tags = item["tags"];
      if (!tags) return false;
      if (Array.isArray(tags)) {
        return advancedSearch
          ? tags.some((a) => this.normalizeInput(a).includes(s))
          : this.filters.tag.some((r) => tags.includes(r));
      } else
        return advancedSearch
          ? this.normalizeInput(tags).includes(s)
          : this.filters.tag.includes(tags);
    },
    /**
     * Check if item's date is in range.
     * @param item
     * @param wks
     * @returns {boolean}
     */
    checkWithinWeeks(item, wks) {
      let toCheck = new Date(item.date);
      let d = new Date();
      d.setDate(d.getDate() - 7 * wks);
      return toCheck > d;
    },
    /**
     * Normalize the input
     * @param input
     * @returns {string|string}
     */
    normalizeInput(input) {
      return !input
        ? ""
        : input
            .toLowerCase()
            .normalize("NFD")
            .replace(/\p{Diacritic}/gu, "");
    },
    /**
     * Check for excluded words
     * @param item
     * @param word
     * @param isNegative
     * @returns {boolean}
     */
    checkWord(item, word, isNegative) {
      switch (item.type) {
        case "podcast":
          return this.filterPodcast(item, word, isNegative);
        case "video":
          return this.filterVideo(item, word, isNegative);
        case "stream":
          return this.filterStream(item, word, isNegative);
      }
    },
    /**
     * Filter video on title & description & activity
     * @param v video object
     * @param w word
     * @param negative
     * @returns {boolean}
     */
    filterVideo(v, w, negative = false) {
      return (
        (this.normalizeInput(v["title"]).includes(w) ||
          this.normalizeInput(v["description"]).includes(w) ||
          (Array.isArray(v["activity"])
            ? v["activity"].some((act) => {
                return this.normalizeInput(act).includes(w);
              })
            : this.normalizeInput(v["activity"]).includes(w))) !== negative
      );
    },
    /**
     * Filter podcast on title & description
     * @param p podcast object
     * @param w word
     * @param negative
     * @returns {boolean}
     */
    filterPodcast(p, w, negative = false) {
      return (
        (this.normalizeInput(p["title"]).includes(w) ||
          this.normalizeInput(p["description"]).includes(w)) !== negative
      );
    },
    /**
     * Filter stream on title & custom_title & description & activities & tags
     * @param s stream object
     * @param w word
     * @param negative
     * @returns {boolean}
     */
    filterStream(s, w, negative = false) {
      return (
        (this.normalizeInput(s["description"]).includes(w) ||
          (s["titles"]
            ? s["titles"].some((title) => {
                return this.normalizeInput(title).includes(w);
              })
            : false) ||
          (s["custom_title"] && this.normalizeInput(s["custom_title"]).includes(w)) ||
          (s["activities"]
            ? s["activities"].some((game) => {
                return this.normalizeInput(game.title).includes(w);
              })
            : false) ||
          (s["tags"]
            ? s["tags"].some((tag) => {
                return this.normalizeInput(tag).includes(w);
              })
            : false)) !== negative
      );
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
      const pickedNums = [];
      nums.forEach((num) => {
        while (
          (!this.filteredData[num]["twitch_id"] && !this.filteredData[num]["youtube_id"]) ||
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
    setFilterFromQuery(urlParams) {
      if (urlParams.getAll("type")) this.filters.type = urlParams.getAll("type");
      if (urlParams.getAll("platform")) this.filters.platform = urlParams.getAll("platform");
      if (urlParams.getAll("activity")) this.filters.activity = urlParams.getAll("activity");
      if (urlParams.getAll("tag")) this.filters.tag = urlParams.getAll("tag");
      if (urlParams.get("free")) this.filters.free = urlParams.get("free");
      if (urlParams.get("hide_seen")) this.filters.hideSeen = urlParams.get("hide_seen");
      if (urlParams.get("vod")) this.filters.vod = urlParams.get("vod");
      if (urlParams.get("date")) this.filters.date.range = urlParams.get("date");
      if (this.filters.date.range === "other") {
        if (urlParams.get("date_after")) this.filters.date.after = urlParams.get("date_after");
        if (urlParams.get("date_before")) this.filters.date.before = urlParams.get("date_before");
      }

      if (urlParams.get("duration")) this.filters.duration = urlParams.get("duration");
      this.search = urlParams.get("search") || "";
      router.replace({ query: null }).then((r) => {});
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
      let search_params = new URLSearchParams(types.concat(acts).concat(platforms).concat(tags));
      if (this.filters.free) search_params.append("free", this.filters.free);
      if (this.filters.hideSeen) search_params.append("hide_seen", this.filters.hideSeen);
      if (this.filters.vod) search_params.append("vod", this.filters.vod);
      if (this.filters.duration) search_params.append("duration", this.filters.duration);
      if (this.search) search_params.append("search", this.search);
      if (this.filters.date.range) search_params.append("date", this.filters.date.range);

      if (this.filters.date.range === "other") {
        if (this.filters.date.after) search_params.append("date_after", this.filters.date.after);
        if (this.filters.date.before) search_params.append("date_before", this.filters.date.before);
      }

      return search_params.toString();
    },
  },
});
