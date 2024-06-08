<template>
    <transition>
        <div :key="card.id">
            <img :src="imgScr" alt="thumbnail" class="w-100 rounded-3 mb-3">
            <h5 class="fw-bold">{{ title }}</h5>
            <!-- description -->
            <div class="card border-0 mb-3" style="background-color: rgba(255,255,255,0.1)">
                <div class="card-body">
                    <div class="d-flex gap-3 mb-3 small">
                        <span>
                            <i class="bi bi-clock me-2"></i>
                            <span>{{ duration }}</span>
                        </span>
                        <span>
                            <i class="bi bi-calendar4-range me-2"></i>
                            <span>{{ date }}</span>
                        </span>
                    </div>
                    <p v-if="card.description">{{ card.description }}</p>
                    <a
                        :href="`https://docs.google.com/forms/d/e/1FAIpQLSeuPAoJu8xsn6JrxrYnRY5v2hw6iSj3eZCXX8QIpFqN6Uy1bA/viewform?usp=pp_url&entry.483165980=${card.id}`"
                        target="_blank">Stuur een beschrijving op!</a>
                </div>
            </div>
            <!-- links -->
            <div class="card border-0 mb-3" style="background-color: rgba(255,255,255,0.1)">
                <div class="card-body">
                    <div class="d-flex gap-3">
                        <i class="bi bi-link-45deg fs-5 lh-1"></i>
                        <div class="d-flex gap-2 flex-wrap text-capitalize">
                            <a v-if="card['twitch_id']" :href="'https://www.twitch.tv/videos/' + card['twitch_id']" target="_blank">
                                <span class="badge rounded-pill text-wrap text-decoration-underline"><i class="bi bi-twitch me-2"></i>Twitch</span>
                            </a>
                            <a v-if="card['youtube_id']" :href="'https://youtube.com/watch?v=' + card['youtube_id']" target="_blank">
                                <span class="badge rounded-pill text-wrap text-decoration-underline"><i class="bi bi-youtube me-2"></i>YouTube</span>
                            </a>
                            <a v-if="card['twitchtracker_id']" :href="'https://twitchtracker.com/lekkerspelen/streams/' + card['twitchtracker_id']" target="_blank">
                                <span class="badge rounded-pill text-wrap text-decoration-underline"><i class="bi bi-twitch me-2"></i>TwitchTracker</span>
                            </a>
                            <a v-for="(extra, idx) in card['extra_urls']" :href="extra" target="_blank">
                                <span class="badge rounded-pill text-wrap text-decoration-underline"><i class="bi bi-gift me-2"></i>Extra {{ idx + 1 }}</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <!-- games/activities -->
            <div class="card border-0 mb-3" style="background-color: rgba(255,255,255,0.1)">
                <div class="card-body">
                    <div class="d-flex gap-3">
                        <i class="bi bi-controller fs-5 lh-1"></i>
                        <div class="d-flex gap-2 flex-wrap text-capitalize">
                            <span v-if="!card.activities?.length && !card.activity?.length"
                                  class="badge rounded-pill text-wrap">-</span>
                            <span v-for="act in card.activities"
                                  :title="`Zoek op '${act.title}'`"
                                  class="badge rounded-pill text-wrap" type="button"
                                  @click="searchActivity(act.title)">{{ act.title }}</span>
                            <template v-if="Array.isArray(card.activity)">
                                <span v-for="act in card.activity"
                                      :title="`Zoek op '${act}'`" class="badge rounded-pill text-wrap"
                                      type="button"
                                      @click="searchActivity(act)">{{ act }}</span>
                            </template>
                            <span v-if="card.activity" :title="`Zoek op '${card.activity}'`"
                                  class="badge rounded-pill text-wrap" type="button"
                                  @click="searchActivity(card.activity)">{{ card.activity }}</span>
                        </div>
                    </div>
                </div>
            </div>
            <!-- tags -->
            <div class="card border-0 mb-3" style="background-color: rgba(255,255,255,0.1)">
                <div class="card-body">
                    <div class="d-flex gap-3">
                        <i class="bi bi-tag fs-5 lh-1"></i>
                        <div class="d-flex gap-2 flex-wrap text-capitalize">
                            <span v-if="!card.tags?.length" class="badge rounded-pill">-</span>
                            <span v-for="tag in card.tags" class="badge rounded-pill">{{
                                    tag
                                }}</span>
                        </div>
                    </div>
                </div>
            </div>
            <!-- series -->
            <div class="card border-0 mb-3" style="background-color: rgba(255,255,255,0.1)">
                <div class="card-body">
                    <div class="d-flex gap-3">
                        <i class="bi bi-collection-play fs-5 lh-1"></i>
                        <div v-if="!collectionName" class="d-flex gap-2 flex-wrap text-capitalize">
                            <span class="badge rounded-pill">-</span>
                        </div>
                        <div v-if="collectionName" class="row g-2 overflow-y-auto" style="max-height: 300px">
                            <span v-if="collectionName" class="badge rounded-pill">{{ collectionName }}</span>
                            <div class="col-6" v-for="card in collectionItems">
                                <mini-card-component :card="card"></mini-card-component>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- actions -->
            <div class="card border-0 mb-3" style="background-color: rgba(255,255,255,0.1)">
                <div class="card-body">
                    <div class="d-flex flex-wrap gap-2">
                        <button :class="{active: isLiked}" class="btn btn-sm btn-outline-success rounded-pill"
                                type="button" @click="generalStore.toggleLikedItem(card.id)"><i
                            :class="isLiked ? 'bi-hand-thumbs-up-fill' : 'bi-hand-thumbs-up'" class="bi me-1"></i>Like
                        </button>
                        <button :class="{active: isSeen}" class="btn btn-sm btn-outline-secondary rounded-pill"
                                type="button" @click="generalStore.toggleSeenItem(card.id)"><i
                            :class="isSeen ? 'bi-eye-fill' : 'bi-eye'" class="bi me-1"></i>Gezien
                        </button>
                        <button :data-bs-target="'#playlistModal-' + card.id"
                                class="btn btn-sm btn-outline-secondary rounded-pill"
                                data-bs-toggle="modal" type="button"><i
                            class="bi bi-collection-play me-1"></i>Bewaar
                        </button>
                        <button class="btn btn-sm btn-outline-secondary rounded-pill" @click="copyLink"><i class="bi bi-copy me-2"></i>Kopieer link
                        </button>
                    </div>
                </div>
            </div>
            <!-- info -->
            <div class="card border-0" style="background-color: rgba(255,255,255,0.1)">
                <div class="card-body">
                    <div class="d-flex gap-3">
                        <div><span class="small fst-italic">Item-nummer: {{ card.id }}</span></div>
                        <div class="ms-auto">
                            <a :href="`https://docs.google.com/forms/d/e/1FAIpQLSeuPAoJu8xsn6JrxrYnRY5v2hw6iSj3eZCXX8QIpFqN6Uy1bA/viewform?usp=pp_url&entry.483165980=${card.id}`"
                               target="_blank">Feedback</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </transition>

    <!-- Modal -->
    <teleport to="body">
        <playlist-modal :id="card.id" :key="card['id']"/>
    </teleport>

</template>
<script setup>
import {computed, onMounted, onUpdated} from "vue";
import {useContentStore} from "@/stores/content.js";
import {storeToRefs} from "pinia";
import {useGeneralStore} from "@/stores/general.js";
import PlaylistModal from "@/components/PlaylistModal.vue";
import MiniCardComponent from "@/components/miniCardComponent.vue";

const contentStore = useContentStore()
const generalStore = useGeneralStore()
const {images, filters} = storeToRefs(contentStore)
const {likedItems, seenItems} = storeToRefs(generalStore)

const props = defineProps({
    card: {type: Object, required: true}
})

const card = computed(() => {
    return props.card
})

const imgScr = computed(() => {
    return images.value['640'][`${props.card['twitch_id']}`] ||
        images.value['640'][`${props.card['youtube_id']}`] ||
        (!props.card['twitch_id'] && !props.card['youtube_id'] ? images.value['640'][`no_video`] : images.value['640'][`default`])
})

const duration = computed(() => {
    return secondsToHms()
})
const title = computed(() => {
    return setMainTitle()
})
const shareUrl = computed(() => {
    const host = window.location.host;
    return `${host}/item/${card.value['id']}`
})
const isLiked = computed(() => {
    return likedItems.value.includes(props.card['id'])
})
const isSeen = computed(() => {
    return seenItems.value.includes(props.card['id'])
})
const date = computed(() => {
    return date ? new Date(props.card['date']).toLocaleString('nl-NL', {
        weekday: 'short',
        day: "2-digit",
        month: "long",
        year: "2-digit",
    }) : '-'
})
const collectionName = computed(() => {
    return card.value.collection ? contentStore.getCollection(card.value.collection).title : null
})
const collectionItems = computed(() => {
    return collectionName.value ? contentStore.getSingleCollection(card.value['collection']) : []
})

onMounted(() => {
    generalStore.updateHistory(card.value.id)
    setMetaData()
})

onUpdated(() => {
    setMetaData()
})

/**
 * Set page meta data
 */
function setMetaData() {
    document.title = "Lekker Speuren - " + title.value;
    document.querySelector('meta[name="title"]').setAttribute("content", "Lekker Speuren - " + title.value);
    document.querySelector('meta[property="og:title"]').setAttribute("content", "Lekker Speuren - " + title.value);
    document.querySelector('meta[property="twitter:title"]').setAttribute("content", "Lekker Speuren - " + title.value);
    document.querySelector('meta[property="og:url"]').setAttribute("content", shareUrl.value);
    document.querySelector('meta[property="twitter:url"]').setAttribute("content", shareUrl.value);
    document.querySelector('meta[property="og:image"]').setAttribute("content", imgScr.value);
    document.querySelector('meta[property="twitter:image"]').setAttribute("content", imgScr.value);
}

/**
 * Convert durations to h-m-s
 * @returns {string}
 */
function secondsToHms() {
    let d = Number(card.value.duration);
    let h = Math.floor(d / 3600);
    let m = Math.floor(d % 3600 / 60);
    let s = Math.floor(d % 3600 % 60);

    return ('0' + h).slice(-2) + ":" + ('0' + m).slice(-2) + ":" + ('0' + s).slice(-2);
}

/**
 * Returns card main title
 * @returns {any}
 */
function setMainTitle() {
    if (['podcast', 'video'].includes(card.value['type']))
        return card.value['title']
    else {
        if (card.value['custom_title'])
            return card.value['custom_title']
        else if (card.value['title_main'])
            return card.value['titles'][card.value['title_main']]
        else
            return card.value['titles'][0]
    }
}

/**
 * Copy link to clipboard
 */
function copyLink() {
    navigator.clipboard.writeText(shareUrl.value);
}

/**
 * Search for clicked activity/game
 * @param activity
 */
function searchActivity(activity) {
    contentStore.resetFilters() //reset
    filters.value.activity = [activity] //set
    contentStore.filter() //call
}
</script>

<style lang="sass" scoped>
.v-enter-active
    transition: opacity 0.3s ease

.v-enter-from,
.v-leave-to
    opacity: 0
</style>