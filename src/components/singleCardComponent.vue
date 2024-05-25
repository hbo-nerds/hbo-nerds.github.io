<template>
    <div>
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
                        <span>{{ card.date }}</span>
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
                    <div><i class="bi bi-link-45deg fs-5"></i></div>
                    <div class="d-flex gap-2 flex-wrap text-capitalize">
                        <a v-if="card['twitch_id']" :href="'https://www.twitch.tv/videos/' + card['twitch_id']" target="_blank">
                            <span class="badge rounded-pill text-wrap">Twitch</span>
                        </a>
                        <a v-if="card['youtube_id']" :href="'https://youtube.com/watch?v=' + card['youtube_id']" target="_blank">
                            <span class="badge rounded-pill text-wrap">YouTube</span>
                        </a>
                        <a v-if="card['twitchtracker_id']" :href="'https://twitchtracker.com/lekkerspelen/streams/' + card['twitchtracker_id']" target="_blank">
                            <span class="badge rounded-pill text-wrap">TwitchTracker</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>

        <!-- games/activities -->
        <div class="card border-0 mb-3" style="background-color: rgba(255,255,255,0.1)">
            <div class="card-body">
                <div class="d-flex gap-3">
                    <div><i class="bi bi-controller fs-5"></i></div>
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
                    <div><i class="bi bi-tag fs-5"></i></div>
                    <div class="d-flex gap-2 flex-wrap text-capitalize">
                        <span v-if="!card.tags?.length" class="badge rounded-pill">-</span>
                        <span v-for="tag in card.tags" class="badge rounded-pill">{{
                                tag
                            }}</span>
                    </div>
                </div>
            </div>
        </div>
        <!-- info -->
        <div class="card border-0 mb-3" style="background-color: rgba(255,255,255,0.1)">
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

        <div class="card border-0" style="background-color: rgba(255,255,255,0.1)">
            <div class="card-body">
                <!-- watch -->
                <div class="row gy-3 mb-3">
                    <div class="col-12 col-md-4">
                        <div class="d-flex">
                            <a v-if="card['twitchtracker_id']"
                               :href="'https://twitchtracker.com/lekkerspelen/streams/' + card['twitchtracker_id']"
                               class="d-block"
                               target="_blank">TwitchTracker</a>
                        </div>
                    </div>
                </div>
                <!-- actions -->
                <div>
                    <button :class="{active: isLiked}" class="btn btn-sm btn-outline-success rounded-pill me-2"
                            type="button" @click="generalStore.toggleLikedItem(card.id)"><i
                        :class="isLiked ? 'bi-hand-thumbs-up-fill' : 'bi-hand-thumbs-up'" class="bi me-1"></i>Like
                    </button>
                    <button :class="{active: isSeen}" class="btn btn-sm btn-outline-secondary rounded-pill me-2"
                            type="button" @click="generalStore.toggleSeenItem(card.id)"><i
                        :class="isSeen ? 'bi-eye-fill' : 'bi-eye'" class="bi me-1"></i>Gezien
                    </button>
                    <button :data-bs-target="'#playlistModal-' + card.id"
                            class="btn btn-sm btn-outline-secondary rounded-pill"
                            data-bs-toggle="modal" type="button"><i
                        class="bi bi-collection-play me-1"></i>Bewaar
                    </button>
                </div>
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
    return `${host}/item/${card.value['id']}`
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