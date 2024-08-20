<template>
    <div class="card h-100 border-0 bg-transparent">
        <div @click="goToCard" @click.middle="goToCard('middle')" class="img-wrapper position-relative"
             :class="card.type === 'podcast' ? 'border-success' : card.type === 'video' ? 'border-yt' : 'border-tw'" type="button">

            <div class="corner-top"></div>
            <div class="corner-bottom"></div>
            <div class="edge-left"></div>
            <div class="edge-bottom"></div>

            <div class="transform-wrapper position-relative">
                <img v-lazy="{ src: imgScr, loading: images['320'][`default`]}" class="w-100" alt="thumbnail">
                <span class="badge rounded-0 bg-black position-absolute bottom-0 end-0 m-2"
                      style="--bs-bg-opacity: .75;">{{ duration }}</span>
                <span v-if="card.type === 'stream' && card.free"
                      class="badge rounded-0 bg-warning position-absolute top-0 end-0 m-2 text-uppercase">
                    Gratis
                </span>
                <span v-if="card.id === selectedCardId"
                      class="badge rounded-0 bg-secondary position-absolute top-0 end-0 m-2 text-uppercase">
                    Open
                </span>

                <div v-if="isSeen" class="bg-dark opacity-75 position-absolute top-0 bottom-0 start-0 end-0 d-flex align-items-center justify-content-center">
                    <i class="text-light bi bi-eye-fill fs-4 opacity-100"></i>
                </div>
            </div>

        </div>
        <div class="card-body pt-3 pb-0 px-0">
            <div class="d-flex justify-content-between gap-2 position-relative">
                <a v-if="card['twitch_id']" :href="'https://www.twitch.tv/videos/' + card['twitch_id']" target="_blank">
                    <img class="rounded-circle" src="../assets/img/twitch.png" width="32" height="32" alt="logo">
                </a>
                <a v-else-if="card['type'] === 'podcast'" :href="'https://youtube.com/watch?v=' + card['youtube_id']" target="_blank">
                    <img class="rounded-circle" src="../assets/img/podcast.png" width="32" height="32" alt="logo">
                </a>
                <a v-else-if="card['youtube_id']" :href="'https://youtube.com/watch?v=' + card['youtube_id']" target="_blank">
                    <img class="rounded-circle" src="../assets/img/youtube.png" width="32" height="32" alt="logo">
                </a>

                <div class="meta flex-grow-1">
                    <h3 @click="goToCard" @click.middle="goToCard('middle')" type="button" class="fs-6 fw-bold mb-1">{{ isSeries ? `${collectionName} - (${collectionCount})` : title }}</h3>

                    <div class="inline-meta text-body-secondary">
                        <span v-if="daysAgo < 14" class="small">{{ daysAgo }} {{ daysAgo > 1 ? 'dagen' : 'dag' }} geleden</span>
                        <span v-else-if="weeksAgo < 4" class="small">{{ weeksAgo }} {{ weeksAgo > 1 ? 'weken' : 'week' }} geleden</span>
                        <span v-else-if="monthsAgo < 12" class="small">{{ monthsAgo }} {{ monthsAgo > 1 ? 'maanden' : 'maand' }} geleden</span>
                        <span v-else class="small">{{ yearAgo }} jaar geleden</span>
                        <span v-if="card['collection']" class="small"><i class="bi bi-collection-play"></i></span>
                    </div>
                    <div class="inline-meta text-body-secondary">
                        <span v-for="act in card['activities']?.slice(0, 1)" class="small">{{ act.title }} {{card['activities']?.length > 1 ? 'en meer' : ''}}</span>
                    </div>
                    <div class="inline-meta text-body-secondary" v-if="Array.isArray(card['activity'])">
                        <span v-for="act in card['activity']?.slice(0, 1)" class="small">{{ act }} {{ card['activity']?.length > 1 ? 'en meer' : '' }}</span>
                    </div>
                    <div class="inline-meta text-body-secondary" v-else-if="card['activity']">
                        <span class="small">{{ card['activity'] }}</span>
                    </div>
                </div>
                <div>
                    <button class="btn btn-sm btn-dark rounded-circle" data-bs-toggle="dropdown" aria-expanded="false">
                        <i class="bi bi-three-dots-vertical"></i>
                    </button>
                    <ul class="dropdown-menu dropdown-menu-end">
                        <li v-if="card['collection']">
                            <router-link class="dropdown-item" :to="{name: 'single-serie', params: {id: card['collection'] }}" title="Ga naar serie">
                                <i class="bi bi-collection-play me-2"></i>Naar collectie
                            </router-link>
                        </li>
                        <li><button class="dropdown-item" type="button" @click="generalStore.toggleSeenItem(card['id'])"><i class="bi bi-eye me-2"></i>{{ isSeen ? 'Niet gezien' : 'Gezien'}}</button></li>
                        <li><button class="dropdown-item" type="button" data-bs-toggle="modal" :data-bs-target="'#playlistModal-' + card['id']"><i class="bi bi-collection-play me-2"></i>Bewaar</button></li>
                        <li><button class="dropdown-item" type="button" @click="generalStore.toggleLikedItem(card['id'])"><i class="bi bi-hand-thumbs-up me-2"></i>{{ isLiked ? 'Niet leuk' : 'Leuk!'}}</button></li>
                    </ul>
                </div>
            </div>
        </div>
        <div v-if="isSeries" class="stack rounded-3 border border-3 z-0"></div>
    </div>

    <!-- Modal -->
    <teleport to="body">
        <playlist-modal :id="card['id']" :key="card['id']"/>
    </teleport>
</template>

<script setup>
import {computed} from "vue";
import {useContentStore} from "@/stores/content.js";
import {storeToRefs} from "pinia";
import router from "@/router/index.js";
import {useGeneralStore} from "@/stores/general.js";
import PlaylistModal from "@/components/PlaylistModal.vue";

const props = defineProps({
    card: {type: Object, required: true},
    isSeries: {type: Boolean, default: false}
})
const contentStore = useContentStore()
const generalStore = useGeneralStore()
const {images, selectedCardId} = storeToRefs(contentStore)
const {seenItems, likedItems} = storeToRefs(generalStore)

const imgScr = computed(() => {
    return images.value['320'][`${props.card['twitch_id']}`] ||
        images.value['320'][`${props.card['youtube_id']}`] ||
        (!props.card['twitch_id'] && !props.card['youtube_id'] ? images.value['320'][`no_video`] : images.value['320'][`default`])
})

const duration = computed(() => {
    return secondsToHms()
})
const title = computed(() => {
    if (['podcast', 'video'].includes(props.card['type']))
        return props.card['title']
    else {
        if (props.card['custom_title'])
            return props.card['custom_title']
        else if (props.card['title_main'])
            return props.card['titles'][props.card['title_main']]
        else
            return props.card['titles'][0]
    }
})

const collectionName = computed(() => {
    return props.card['collection'] ? contentStore.getCollection(props.card['collection']).title : null
})
const collectionCount = computed(() => {
    return props.card['collection'] ? contentStore.countSeriesItems(props.card['collection']) : 0
})
const isSeen = computed(() => {
    return seenItems.value.includes(props.card['id'])
})
const isLiked = computed(() => {
    return likedItems.value.includes(props.card['id'])
})

function secondsToHms() {
    let d = Number(props.card.duration);
    let h = Math.floor(d / 3600);
    let m = Math.floor(d % 3600 / 60);
    let s = Math.floor(d % 3600 % 60);

    return ('0' + h).slice(-2) + ":" + ('0' + m).slice(-2) + ":" + ('0' + s).slice(-2);
}

/**
 * Navigate to item
 * @param type
 */
function goToCard(type = 'left') {
    selectedCardId.value = selectedCardId.value === props.card['id'] ? null : props.card['id']
    // const path = props.isSeries ? `/series/${props.card['collection']}` : `/item/${props.card['id']}`
    // if (type === 'middle') {
    //     const routeData = router.resolve({path: path});
    //     window.open(routeData.href, '_blank');
    // } else
    //     router.push({path: path})
}


const daysAgo = computed(() => {
    return Math.round((new Date() - new Date(props.card['date'])) / (24 * 60 * 60 * 1000));
})
const weeksAgo =  computed(() => {
    return Math.round((new Date() - new Date(props.card['date'])) / (7 * 24 * 60 * 60 * 1000));
})
const monthsAgo =  computed(() => {
    const now = new Date();
    return  now.getMonth() - new Date(props.card['date']).getMonth() +
        (12 * ( now.getFullYear() - new Date(props.card['date']).getFullYear()))
})
const yearAgo =  computed(() => {
    return new Date().getFullYear() - new Date(props.card['date']).getFullYear();
})
</script>

<style scoped lang="sass">
//.card
//    &:hover .action-btn
//        visibility: unset
//    .action-btn
//        visibility: hidden

.meta h3
    overflow: hidden
    text-overflow: ellipsis
    display: -webkit-box
    -webkit-line-clamp: 2
    -webkit-box-orient: vertical

.inline-meta
    line-height: 16px
    span:not(:first-of-type):before
        margin: 0 4px
        content: "•"
.stack
    position: absolute
    top: -4px
    height: 16px
    left: 8px
    right: 8px
    margin-top: -1px

.img-wrapper
    *
        transition-property: transform
        transition-timing-function: ease
        transition-duration: 100ms

    &.border-success
        .corner-top
            border-right-color: rgb(25, 135, 84)

        .corner-bottom
            border-top-color: rgb(25, 135, 84)

        .edge-left, .edge-bottom
            background: rgb(25, 135, 84)

    &.border-yt
        .corner-top
            border-right-color: #FF0000

        .corner-bottom
            border-top-color: #FF0000

        .edge-left, .edge-bottom
            background: #FF0000

    &.border-tw
        .corner-top
            border-right-color: #6441A5

        .corner-bottom
            border-top-color: #6441A5

        .edge-left, .edge-bottom
            background: #6441A5

    &:hover
        .corner-top, .corner-bottom,
        .edge-left, .edge-bottom
            transition-delay: 75ms

        .corner-top
            transform: translateY(-0.4rem) scale(1)

        .corner-bottom
            transform: translateX(0.4rem) scale(1)

        .edge-left
            transform: scaleX(1)

        .edge-bottom
            transform: scaleY(1)

        .transform-wrapper
            transform: translate3d(0.4rem, -0.4rem, 0px)
            transition-delay: 75ms

.corner-top
    position: absolute
    top: 0
    left: 0
    width: 0
    height: 0
    border-top: 0.4rem solid transparent
    border-bottom: 0.4rem solid transparent
    border-right: 0.4rem solid
    transform-origin: left center
    transform: translateY(-0.4rem) scale(0)
.corner-bottom
    position: absolute
    bottom: 0
    right: 0
    width: 0
    height: 0
    border-left: 0.4rem solid transparent
    border-right: 0.4rem solid transparent
    border-top: 0.4rem solid
    transform-origin: center bottom
    transform: translateX(0.4rem) scale(0)
.edge-left
    position: absolute
    top: 0
    bottom: 0
    left: 0
    transform-origin: 0 100%
    width: 0.4rem
    transform: scaleX(0)
.edge-bottom
    position: absolute
    bottom: 0
    left: 0
    right: 0
    transform-origin: 0 100%
    height: 0.4rem
    transform: scaleY(0)

</style>
