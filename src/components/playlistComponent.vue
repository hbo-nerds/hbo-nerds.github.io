<template>
    <div class="card h-100 border-0 bg-transparent position-relative">
        <div @click="goToCard" @click.middle="goToCard('middle')" class="thumbnail-wrapper position-relative rounded-3 z-1">
            <img v-lazy="{ src: imgScr, loading: images['320'][`default`]}" class="w-100 rounded-3 border border-3" alt="thumbnail">
            <span class="badge rounded-0 bg-black position-absolute bottom-0 end-0 m-2"
                  style="--bs-bg-opacity: .75;"><i class="bi bi-collection-play me-1"></i>{{ playlist['items'].length }} {{ playlist['items'].length > 1 ? 'items' : 'item' }}</span>
        </div>
        <div class="card-body py-3 px-0">
            <div class="d-flex justify-content-between gap-2">



                <div class="meta flex-grow-1">
                    <h3 @click="goToCard" @click.middle="goToCard('middle')" type="button" class="fs-6 fw-bold mb-1">{{ playlist['title'] }}</h3>
                </div>
                <div>
                    <button class="action-btn btn btn-sm btn-link" data-bs-toggle="dropdown" aria-expanded="false">
                        <i class="bi bi-three-dots-vertical"></i>
                    </button>
                    <ul class="dropdown-menu">
                        <li><button @click="generalStore.deletePlaylist(playlist['title'])" class="dropdown-item" type="button"><i class="bi bi-trash me-2"></i>Verwijder</button></li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="stack rounded-1 z-0"></div>
    </div>
</template>

<script setup>
import {computed, onBeforeMount, ref} from "vue";
import {useContentStore} from "@/stores/content.js";
import {useGeneralStore} from "@/stores/general.js";
import {storeToRefs} from "pinia";
import router from "@/router/index.js";
const generalStore = useGeneralStore()

const props = defineProps({
    playlist: {type: Object, required: true},
})
const contentStore = useContentStore()
const {images} = storeToRefs(contentStore)

const card = ref(null)

const imgScr = computed(() => {
    return card.value ? images.value['320'][`${card.value['twitch_id']}`] ||
        images.value['320'][`${card.value['youtube_id']}`] ||
        (!card.value['twitch_id'] && !card.value['youtube_id'] ? images.value['320'][`no_video`] : images.value['320'][`default`]) : images.value['320'][`default`]
})

onBeforeMount(() => {
    if (props.playlist.items.length)
        card.value = contentStore.getSingleCard(props.playlist.items[0])
})

/**
 * Navigate to item
 * @param type
 */
function goToCard(type = 'left') {
    const path = `/you/playlist/${props.playlist['title']}`
    if (type === 'middle') {
        const routeData = router.resolve({path: path});
        window.open(routeData.href, '_blank');
    } else {
        router.push({name: 'single-playlist', params: {title: props.playlist['title']}})
    }
}
</script>

<style scoped lang="sass">
.card
    &:hover .action-btn
        visibility: unset
    .action-btn
        visibility: hidden

.thumbnail-wrapper:hover,
.card-title:hover
    cursor: pointer
.card-title
    overflow: hidden
    text-overflow: ellipsis
    display: -webkit-box
    -webkit-line-clamp: 2
    -webkit-box-orient: vertical

.platform-link img
    height: 24px
    width: 24px
.stack
    position: absolute
    top: -4px
    width: calc(100% - 16px)
    height: 20%
    left: 8px
    right: 8px
    background-color: #606060
    margin-top: -1px
    border-top: 1px solid #0f0f0f
</style>
