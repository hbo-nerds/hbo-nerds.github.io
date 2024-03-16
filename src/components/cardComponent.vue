<template>
    <div class="card h-100 border-0 bg-transparent">
        <div @click="goToCard" @click.middle="goToCard('middle')" class="thumbnail-wrapper position-relative border border-3 rounded-1" :class="card.type === 'podcast' ? 'border-success' :
            card.type === 'video' ? 'border-yt' : 'border-tw'">
            <img v-lazy="{ src: imgScr, loading: images['320'][`default`]}" class="w-100" alt="thumbnail">
            <span class="badge rounded-0 bg-black position-absolute top-0 start-0"
                  style="--bs-bg-opacity: .75;">{{ card.date }}</span>
            <span class="badge rounded-0 bg-black position-absolute bottom-0 end-0"
                  style="--bs-bg-opacity: .75;">{{ duration }}</span>
            <span class="badge rounded-0 position-absolute top-0 end-0 text-uppercase fw-bold" :class="card.type === 'podcast' ? 'bg-success' :
            card.type === 'video' ? 'bg-yt' : 'bg-tw'">{{ card.type }}</span>
            <div class="position-absolute bottom-0 start-0" @click.stop>
                <a :href="'https://www.twitch.tv/videos/' + card['twitch_id']" class="platform-link"
                   v-if="card['twitch_id']" target="_blank"><img src="../assets/img/twitch.png" alt="logo"></a>
                <a :href="'https://youtube.com/watch?v=' + card['youtube_id']" class="platform-link"
                   v-if="card['youtube_id']" target="_blank"><img src="../assets/img/youtube.png" alt="logo"></a>
            </div>
        </div>
        <div class="card-body py-2 px-0">
            <div @click="goToCard" @click.middle="goToCard('middle')" class="card-title m-0">{{ title }}</div>
            <router-link v-if="card['collection']" :to="{name: 'single-serie', params: {id: card['collection'] }}" title="Ga naar serie"><span class="badge text-bg-secondary text-truncate me-1"
                                     style="max-width: 100%"><i
                class="bi bi-folder-fill me-1"></i>{{ `${collectionName} (${collectionCount})` }}</span></router-link>
            <span class="badge text-bg-warning text-truncate me-1" style="max-width: 100%"
                  v-if="card.type === 'stream' && card.free"><i class="bi bi-star me-1"></i>Gratis stream</span>
        </div>
    </div>
</template>

<script setup>
import {computed} from "vue";
import {useContentStore} from "@/stores/content.js";
import {storeToRefs} from "pinia";
import router from "@/router/index.js";

const props = defineProps({
    card: {type: Object, required: true},
    isSeries: {type: Boolean, default: false}
})
const contentStore = useContentStore()
const {images} = storeToRefs(contentStore)

const imgScr = computed(() => {
    return images.value['320'][`${props.card['twitch_id']}`] ||
        images.value['320'][`${props.card['youtube_id']}`] ||
        (!props.card['twitch_id'] && !props.card['youtube_id'] ? images.value['320'][`no_video`] : images.value['320'][`default`])
})

const duration = computed(() => {
    return secondsToHms()
})
const title = computed(() => {
    return setMainTitle()
})

const collectionName = computed(() => {
    return props.card['collection'] ? contentStore.getCollection(props.card['collection']).title : null
})
const collectionCount = computed(() => {
    return props.card['collection'] ? contentStore.countSeriesItems(props.card['collection']) : 0
})

function secondsToHms() {
    let d = Number(props.card.duration);
    let h = Math.floor(d / 3600);
    let m = Math.floor(d % 3600 / 60);
    let s = Math.floor(d % 3600 % 60);

    return ('0' + h).slice(-2) + ":" + ('0' + m).slice(-2) + ":" + ('0' + s).slice(-2);
}

function setMainTitle() {
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
}

/**
 * Navigate to item
 * @param type
 */
function goToCard(type = 'left') {
    const path = props.isSeries ? `/series/${props.card['collection']}` : `/item/${props.card['id']}`
    if (type === 'middle') {
        const routeData = router.resolve({path: path});
        window.open(routeData.href, '_blank');
    } else
        router.push({path: path})
}
</script>

<style scoped lang="sass">
.thumbnail-wrapper:hover,
.card-title:hover
    cursor: pointer

.platform-link img
    height: 24px
    width: 24px
</style>
