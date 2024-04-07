<template>
    <div class="card h-100 border-0 bg-transparent position-relative">
        <div @click="goToCard" @click.middle="goToCard('middle')" class="z-1 thumbnail-wrapper position-relative border border-3 rounded-1 border-yt">
            <img v-lazy="{ src: imgScr, loading: images['320'][`default`]}" class="w-100" alt="thumbnail">
            <span class="badge rounded-0 bg-black position-absolute bottom-0 end-0"
                  style="--bs-bg-opacity: .75;"><i class="bi bi-collection-play me-1"></i>{{ playlist['items'].length }} items</span>
        </div>
        <div class="card-body py-2 px-0">
            <div class="d-flex justify-content-between align-items-baseline">
                <div class="meta">
                    <div @click="goToCard" @click.middle="goToCard('middle')" class="card-title mb-1">{{ playlist['title'] }}</div>
                </div>
                <button class="action-btn btn btn-sm btn-link" data-bs-toggle="dropdown" aria-expanded="false">
                    <i class="bi bi-three-dots-vertical"></i>
                </button>
                <ul class="dropdown-menu">
                    <li><button @click="generalStore.deletePlaylist(playlist['title'])" class="dropdown-item" type="button"><i class="bi bi-trash me-2"></i>Verwijder</button></li>
                </ul>
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
    } else
        router.push({path: path})
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
