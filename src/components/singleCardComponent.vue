<template>
    <div class="row gy-3">

        <div class="col-12 col-md-8 mb-md-0">
            <img class="w-100 rounded-3 mb-3" :src="imgScr" alt="thumbnail">
            <h5 class="fw-bold">{{ title }}</h5>
            <div class="card">
                <div class="card-body">

                    <!-- key items -->
                    <div class="d-flex mb-3">
                        <span class="me-4">
                            <i class="bi bi-clock me-2"></i>
                            <span>{{ duration }}</span>
                        </span>
                        <span class="me-4">
                            <i class="bi bi-calendar4-range me-2"></i>
                            <span>{{ card.date }}</span>
                        </span>
                    </div>
                    <!-- image -->
                    <div class="row gy-3 mb-3">
                        <div class="col-12 col-md-4">
                            <h2 class="fs-5 fw-bold">Bekijk</h2>
                            <a v-if="card['twitch_id']"
                               :href="'https://www.twitch.tv/videos/' + card['twitch_id']"
                               class="me-2 mb-2 d-block" target="_blank"><img class="me-2"
                                                                              style="width: 32px;height: 32px"
                                                                              src="../assets/img/twitch.png" alt="logo">Twitch</a>
                            <a v-if="card['youtube_id']"
                               :href="'https://youtube.com/watch?v=' + card['youtube_id']"
                               class="me-2 mb-2 d-block" target="_blank"><img class="me-2"
                                                                              style="width: 32px;height: 32px"
                                                                              src="../assets/img/youtube.png"
                                                                              alt="logo">Youtube</a>
                            <a v-if="card['twitchtracker_id']"
                               :href="'https://twitchtracker.com/lekkerspelen/streams/' + card['twitchtracker_id']"
                               class="d-block"
                               target="_blank">TwitchTracker</a>
                        </div>
                    </div>
                    <button @click="generalStore.toggleLikedItem(card.id)" type="button"
                            class="btn btn-sm btn-outline-success rounded-pill me-2" :class="{active: isLiked}"><i
                        class="bi me-1" :class="isLiked ? 'bi-hand-thumbs-up-fill' : 'bi-hand-thumbs-up'"></i>Like
                    </button>
                    <button @click="generalStore.toggleSeenItem(card.id)" type="button"
                            class="btn btn-sm btn-outline-secondary rounded-pill me-2" :class="{active: isSeen}"><i
                        class="bi me-1" :class="isSeen ? 'bi-eye-fill' : 'bi-eye'"></i>Gezien
                    </button>
                    <button type="button"
                            class="btn btn-sm btn-outline-secondary rounded-pill"
                            data-bs-toggle="modal" :data-bs-target="'#playlistModal-' + card.id"><i
                        class="bi bi-collection-play me-1"></i>Bewaar
                    </button>
                    <hr>
                    <!-- share -->
                    <div class="d-flex align-items-center">
                        <span class="fw-bold me-3">Deel via</span>
                        <a class="me-2 share"
                           @click="openShare('https://web.whatsapp.com:/send?text=Check dit Lekker Spelen item! ' + shareUrl)"><i
                            class="bg-whatsapp"></i></a>
                        <span class="fw-bold">of</span>
                        <button class="btn btn-link" @click="copyLink"><i class="bi bi-copy me-2"></i>Kopieer link
                        </button>
                    </div>
                    <hr>
                    <!-- properties -->
                    <div class="mb-4">
                        <h2 class="fs-5 fw-bold mb-3">Kenmerken</h2>
                        <div class="row mb-2">
                            <div class="col-4"><strong>Duur</strong></div>
                            <div class="col"><span>{{ duration }}</span></div>
                        </div>
                        <div class="row mb-2">
                            <div class="col-4"><strong>Datum</strong></div>
                            <div class="col"><span>{{ card.date }}</span></div>
                        </div>
                        <div class="row mb-2">
                            <div class="col-4"><strong>Type</strong></div>
                            <div class="col"><span>{{ card.type }}</span></div>
                        </div>
                        <div class="row mb-2">
                            <div class="col-4"><strong>Tags</strong></div>
                            <div class="col">
                                <div class="text-capitalize">
                                    <span v-if="!card.tags?.length">-</span>
                                    <span class="badge rounded-pill text-bg-primary me-1" v-for="tag in card.tags">{{
                                            tag
                                        }}</span>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-4">
                                <strong>Activiteiten</strong>
                            </div>
                            <div class="col">
                                <div class="text-capitalize">
                                    <span v-if="!card.activities?.length && !card.activity?.length">-</span>
                                    <span v-for="act in card.activities" class="badge rounded-pill text-bg-primary me-1 mb-1"
                                          type="button" @click="searchActivity(act.title)" :title="`Zoek op '${act.title}'`">{{ act.title }}</span>
                                    <span v-if="Array.isArray(card.activity)" class="badge rounded-pill text-bg-primary me-1 mb-1"
                                          type="button" @click="searchActivity(act.title)" :title="`Zoek op '${act.title}'`"
                                          v-for="act in card.activity">{{ act }}</span>
                                    <span v-if="card.activity" class="badge rounded-pill text-bg-primary me-1 mb-1"
                                          type="button" @click="searchActivity(card.activity)" :title="`Zoek op '${card.activity}'`">{{ card.activity }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr>
                    <!-- description -->
                    <div class="mb-4">
                        <h2 class="fs-5 fw-bold">Beschrijving</h2>
                        <p v-if="card.description">{{ card.description }}</p>
                        <p><a
                            :href="`https://docs.google.com/forms/d/e/1FAIpQLSeuPAoJu8xsn6JrxrYnRY5v2hw6iSj3eZCXX8QIpFqN6Uy1bA/viewform?usp=pp_url&entry.483165980=${card.id}`"
                            target="_blank">Stuur een beschrijving op!</a></p>
                    </div>
                    <hr>
                    <div class="d-flex justify-content-between">
                        <span class="small">Item-nummer: {{ card.id }}</span>
                        <a :href="`https://docs.google.com/forms/d/e/1FAIpQLSeuPAoJu8xsn6JrxrYnRY5v2hw6iSj3eZCXX8QIpFqN6Uy1bA/viewform?usp=pp_url&entry.483165980=${card.id}`"
                           target="_blank">Feedback</a>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-12 col-md-4">
            <div class="card">
                <div class="card-body">
                    <!-- header -->
                    <header>
                        <h4 class="card-title fw-bold">Serie</h4>
                    </header>
                    <p v-if="collectionName">Bekijk meer uit de '{{ collectionName }}' serie.</p>
                    <p v-else>Maakt deze video deel uit van een serie? <a
                        :href="`https://docs.google.com/forms/d/e/1FAIpQLSeuPAoJu8xsn6JrxrYnRY5v2hw6iSj3eZCXX8QIpFqN6Uy1bA/viewform?usp=pp_url&entry.483165980=${card.id}`"
                        target="_blank">Stuur een beschrijving op!</a></p>
                    <!-- collection -->
                    <template v-if="card.collection">
                        <div class="row series-wrapper">
                            <div class="col-6 col-md-12" v-for="card in collectionItems">
                                <mini-card-component :card="card"></mini-card-component>
                            </div>
                        </div>
                        <hr>
                    </template>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal -->
    <teleport to="body">
        <playlist-modal :id="card.id" :key="card['id']"/>
    </teleport>

</template>
<script setup>
import {computed, onMounted} from "vue";
import {useContentStore} from "@/stores/content.js";
import {storeToRefs} from "pinia";
import MiniCardComponent from "@/components/miniCardComponent.vue";
import router from "@/router/index.js";
import {useGeneralStore} from "@/stores/general.js";
import PlaylistModal from "@/components/PlaylistModal.vue";

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
    return `${host}/#/item/${card.value['id']}`
})
const collectionItems = computed(() => {
    return contentStore.getSingleCollection(card.value['collection'])
})
const collectionName = computed(() => {
    return card.value.collection ? contentStore.getCollection(card.value.collection).title : null
})
const isLiked = computed(() => {
    return likedItems.value.includes(props.card['id'])
})
const isSeen = computed(() => {
    return seenItems.value.includes(props.card['id'])
})

onMounted(() => {
    generalStore.updateHistory(card.value.id)
})

document.title = "Lekker Speuren - " + title.value;
document.querySelector('meta[name="title"]').setAttribute("content", "Lekker Speuren - " + title.value);
document.querySelector('meta[property="og:title"]').setAttribute("content", "Lekker Speuren - " + title.value);
document.querySelector('meta[property="twitter:title"]').setAttribute("content", "Lekker Speuren - " + title.value);
document.querySelector('meta[property="og:url"]').setAttribute("content", shareUrl.value);
document.querySelector('meta[property="twitter:url"]').setAttribute("content", shareUrl.value);
document.querySelector('meta[property="og:image"]').setAttribute("content", imgScr.value);
document.querySelector('meta[property="twitter:image"]').setAttribute("content", imgScr.value);

function openShare(url) {
    window.open(url, '_blank', 'width=1000,height=750')
}

function secondsToHms() {
    let d = Number(card.value.duration);
    let h = Math.floor(d / 3600);
    let m = Math.floor(d % 3600 / 60);
    let s = Math.floor(d % 3600 % 60);

    return ('0' + h).slice(-2) + ":" + ('0' + m).slice(-2) + ":" + ('0' + s).slice(-2);
}

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

function copyLink() {
    navigator.clipboard.writeText(shareUrl.value);
}

function searchActivity(activity) {
    contentStore.resetFilters() //reset
    filters.value.activity = [activity] //set
    contentStore.filter() //call
}
</script>

<style lang="sass" scoped>
.share
    height: 32px

    i
        display: inline-block
        width: 32px
        height: 32px
        background-size: auto 100%

        &.bg-whatsapp
            background-image: url("../../public/social-share-whatsapp.svg")

        &.bg-mail
            background-image: url("../../public/social-share-email.svg")

.series-wrapper
    max-height: 600px
    overflow-y: auto
</style>